// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var Render = require('../../utils/render.js');
var KEY = require('../../utils/storage_key.js');


var APP = getApp()
var GLOBAL_PAGE
Page({
  data: {
    pageName: "public",

    titleText: "斗图加群（管理员微信号：bushitan）",

    displayLoading: true,
    keyword:"今日斗图", //搜索关键字
    page_num:1 , //分页，查询第一页
    // emoticon: [],
    // hotLabel:["金馆长","我想静静","意外","疼！"],  
    hotLabel:[],  
    hidden: false,
    //点击弹出菜单
    displayMenu:false,

    //控制菜单上架
    MENU_TYPE:Render.menu.TYPE,
    menuType:"0",
    menuWidth:0,
    menuHeight:0,

    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,

    //页面渲染数据
    emoticon:[],
    category:[],
    tagList:[],
    tagListDisplay:[],

    //touch选择对象
    selectEmoticon:{id:"",name:"",img_url:""}, //预备编辑的图片
    selectCategory:{id:"",name:""},

    indexShow:false,
    shortcutShow:false,
    emoticonShow:false,
    loadShow:true,

     inputShowed: false,
    //  inputVal: "",
     searchKey:[],//"搞笑","运动","笑屎了","老司机"
     searchResultShowed:false,

     scrollTolowerStatus:1, // 1 初始状态，全部隐藏  2、正在loading 3、返回首页 
     emoticonScrollTop:0 , //表情滚条位置
  },

  //1 关闭所有悬浮框
  hiddenAll:function(){GLOBAL_PAGE.setData({menuType:0})},



  /** 3 点击表情，悬浮菜单
   */
  onMenu: function(e) {
      GLOBAL_PAGE.setData({
        selectEmoticon:{
          id: e.currentTarget.dataset.id, 
          img_url:e.currentTarget.dataset.img_url,
          category_id:e.currentTarget.dataset.category_id,
          size:e.currentTarget.dataset.size,
          static_url:e.currentTarget.dataset.static_url,
          yun_url:e.currentTarget.dataset.yun_url,
          }
      })
      
      // 显示缩略图
      GLOBAL_PAGE.setData({
          menuType: e.currentTarget.dataset.menu_type
      })
  },

  // 4 图片分享
  menuShare:function(){

        var current = GLOBAL_PAGE.data.selectEmoticon.yun_url
        var urls = []
        var e = GLOBAL_PAGE.data.emoticon
        for ( var i = 0;i<e.length;i++)
        {
        if( e[i].menu_type == GLOBAL_PAGE.data.MENU_TYPE.VIDEO)
            continue
        urls.push(e[i].yun_url)
        }
        if( wx.getStorageSync('is_share_info') == "")
        {
            wx.showModal({
                title: '分享提示',
                content:'点击右上角"⋮"，发送给朋友',
                showCancel:false,
                confirmText:"知道了",
                success: function(res) {
                    Render.share(current,urls)
                    wx.setStorageSync('is_share_info',true)
                }
            }) 
        }
        else{
            Render.share(current,urls)
        }
  },

  // 5 菜单收藏按钮，可以收藏多张 
  menuCollect:function(){
    
    if( wx.getStorageSync('session') == ""  )
    {
        wx.showModal({
            title: "登录失败，请先登录“我的”标签，再回来收藏",
            showCancel:false,
        })
        return
    }

    // 5.1 去除重复搜藏
    var select_id = GLOBAL_PAGE.data.selectEmoticon.id
    var emoticon = wx.getStorageSync(KEY.emoticon)
    for(var i=0;i<emoticon.length;i++)
    {
        if (select_id == emoticon[i].img_id)
        {
            wx.showModal({
                title: "请勿重复收藏",
                showCancel:false,
            })
            return
        }
    }

      wx.request({
          url: Api.imgAdd() , 
          method:"GET",
          data: {
            session: wx.getStorageSync(KEY.session),
            img_id: GLOBAL_PAGE.data.selectEmoticon.id,
          },
          success: function(res) {
             console.log("collect success:",res.data)
              var object = res.data
              if (object.status == "true")
              {
                  //收藏成功
                  var e = wx.getStorageSync(KEY.emoticon)
                  e.push(object.img)
                  wx.setStorageSync(KEY.emoticon,e)
                
                    if( wx.getStorageSync('is_collect_info') == "")
                    {
                        wx.showModal({
                            title: '收藏成功',
                            content:'点击左下角“我的”，进入专属表情袋',
                            showCancel:false,
                            confirmText:"知道了",
                            success: function(res) {
                                wx.setStorageSync('is_collect_info',true)
                            }
                        }) 
                    }
                    else{
                        wx.showToast({
                            title: '收藏成功',
                            icon: 'success',
                            duration: 700
                        })
                    }
                  
              }
              else
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })
          },
          fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
          }
      })
  },


  //创建Tag
  createTag:function(category){
      var _cat = category
      var tag = []
      var parent = [],sun_name=[]
      for(var i=0;i<_cat.length;i++)
        if(_cat[i].parent_id ==  null)
          tag.push({
            "parent":_cat[i],
            "sub":[]
          })
          
      for(var i=0;i<_cat.length;i++)
        for(var j=0;j<tag.length;j++)
          if( _cat[i].parent_id == tag[j].parent.category_id)
            tag[j].sub.push(_cat[i])
              //  parent_name.push(_cat[i].name)
      
      console.log(tag)

      GLOBAL_PAGE.setData({
        tagList:tag
      })
  },

 
  renderEmoticon:function(emoticon,add){
    Render.emoticon(GLOBAL_PAGE,emoticon,add)
  },

  //111 滚动条到底，追加图片
  scrollTolower:function(){
        console.log("scrollTolower")

        //非初始状态下，避免疯狂下拉发出无数请求
        //scrollTolowerStatus:1  // 1 初始状态，全部隐藏  2、正在loading 3、返回首页 
        if(GLOBAL_PAGE.data.scrollTolowerStatus != 1 ) 
            return
   
        console.log("not lock")
        GLOBAL_PAGE.setData({
            scrollTolowerStatus:2
        })

        var _keyword = GLOBAL_PAGE.data.keyword
        var url = Api.tagImgQuery() 
        var session = wx.getStorageSync(KEY.session) 
        //获取表情列表
        wx.request({
            url: url, 
            method:"GET",
            data: {
                session: session,
                tag_name : _keyword,
                page_num:GLOBAL_PAGE.data.page_num //从第二页开始查
            },
            success: function(res) {
                var object = res.data
                
                if (object.status == "true")
                {
                   
                   
                    
                    //页数相同，没有下文，不追加更新
                    if (object.page_num == GLOBAL_PAGE.data.page_num)
                        GLOBAL_PAGE.setData({
                            scrollTolowerStatus:3, //没有图片，返回导航
                            page_num:object.page_num //更新page_num 查询页
                        })
                    //有新的页数，追加更新
                    else
                    {
                        GLOBAL_PAGE.setData({
                            scrollTolowerStatus:1, //加载成功，返回初始状态
                            page_num:object.page_num //更新page_num 查询页
                        })
                    }
                    GLOBAL_PAGE.renderEmoticon(object.img_list,true)
                       
                }
                else
                GLOBAL_PAGE.setData({
                    scrollTolowerStatus:3  //错误，提示回到首页
                })
            },
            fail:function(res){
                GLOBAL_PAGE.setData({
                    scrollTolowerStatus:3 //错误，提示回到首页
                })
            },
            complete:function(){
                GLOBAL_PAGE.setData({
                indexShow:false,
                shortcutShow:true,
                emoticonShow:true,
                loadShow:false,
                }) 
            }
        })

  },
  
  //搜索栏
  /**
  * 1 根据keyword，搜索
  */
  searchBtn:function(){
      
    GLOBAL_PAGE.hiddenAll() //隐藏表情框
    //开启loading
   
    GLOBAL_PAGE.setData({
      indexShow:false,
      shortcutShow:true,
      emoticonShow:false,
      loadShow:true,
    }) 

    var keyword = GLOBAL_PAGE.data.keyword
    var tagList = GLOBAL_PAGE.data.tagList
    var hotLabel = []
    for(var i=0;i<tagList.length;i++)
        for(var j=0;j<tagList[i].sub.length;j++)
        {
            if ( keyword == tagList[i].sub[j].name )
            {
                for(var h=0;h<tagList[i].sub.length; h++)
                  hotLabel.push(tagList[i].sub[h].name)
            }
        }

    GLOBAL_PAGE.setData({hotLabel:hotLabel})

    GLOBAL_PAGE.TagImgQueryRequst()
  },

  //图片tag查询
  TagImgQueryRequst:function(){

    //切换tag，返回初始状态
    GLOBAL_PAGE.setData({
        scrollTolowerStatus:1,
        emoticonScrollTop:0,
        page_num:1
    })
    
    var _keyword = GLOBAL_PAGE.data.keyword
    var url = Api.tagImgQuery() 
    var session = wx.getStorageSync(KEY.session) 
    //获取表情列表
     wx.request({
        url: url, 
        method:"GET",
        data: {
          session: session,
          tag_name : _keyword,
          page_num:GLOBAL_PAGE.data.page_num//默认查询第一页
          // category_id: '1',
          // category_name: _keyword,
        },
        success: function(res) {
            var object = res.data
            
            if (object.status == "true")
            {
                GLOBAL_PAGE.renderEmoticon(object.img_list)

                GLOBAL_PAGE.setData({
                    page_num:object.page_num //更新page_num 查询页
                })
            }
            else
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        complete:function(){
            GLOBAL_PAGE.setData({
              indexShow:false,
              shortcutShow:true,
              emoticonShow:true,
              loadShow:false,
            }) 
        }
      })
  },
  /** 2 点击Shortcut按钮，触发search搜索，
   * 更新keyword
   */
  searchShortcut:function(e){
     
    GLOBAL_PAGE.hiddenAll() //隐藏表情框
    
    GLOBAL_PAGE.setData({
      keyword:e.currentTarget.dataset.keyword,
      // inputVal:e.currentTarget.dataset.keyword,
      inputShowed:true,
      searchResultShowed:false,
    })

    //index目录列表
    //临时建立tagListDisplay中间选项，首页查询，所有tag一起展示，
    if(e.currentTarget.dataset.keyword == "目录导航")
    {
        var tagListDisplay = GLOBAL_PAGE.data.tagList   
        GLOBAL_PAGE.setData({
          indexShow:true,
          shortcutShow:false,
          emoticonShow:false,
          loadShow:false,
          tagListDisplay:tagListDisplay
        }) 
        return
    }
    // 单项父类查询，展示长度为1的tag数组，仅有父类一个元素
    var tagList = GLOBAL_PAGE.data.tagList
    for(var i = 0 ; i<tagList.length;i++)
    {
        if( e.currentTarget.dataset.keyword == tagList[i].parent.name)
        {
            var tagListDisplay = [ GLOBAL_PAGE.data.tagList[i] ]
            GLOBAL_PAGE.setData({
              indexShow:true,
              shortcutShow:false,
              emoticonShow:false,
              loadShow:false,
              tagListDisplay:tagListDisplay
            }) 
            return
        }
    }
    // else
    //正常搜索
    GLOBAL_PAGE.searchBtn();

  },
  //3
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  //4
  hideInput: function () {
      this.setData({
        //   keyword: "",
          searchResultShowed: false
      });
  },
  //5
  clearInput: function () {
      this.setData({
          keyword: ""
      });
  },
  //6
  inputTyping: function (e) {
      GLOBAL_PAGE.setData({
          keyword: e.detail.value
      });

      var category = GLOBAL_PAGE.data.category
      var keyword = e.detail.value
      var searchKey = []
      for (var i=0;i< category.length;i++)
      { 
          console.log(keyword,category[i].name ,  category[i].name.indexOf(keyword))
          if(category[i].name.indexOf(keyword) != -1)
              searchKey.push(category[i].name)  
      }

      GLOBAL_PAGE.setData({
          searchKey: searchKey
      });
      

  },

  //7 输入框聚焦
  inpuFocus:function(e){
      GLOBAL_PAGE.setData({
        searchResultShowed:true,
    })
  },
  //8 输入变化显示提示栏
  inpuBlur:function(e){
      GLOBAL_PAGE.setData({
        searchResultShowed:false,
    })
  },

  onShareAppMessage: function () { 
      return {
        title: '表情袋',
        desc: '这有很多《'+GLOBAL_PAGE.data.keyword+'》的表情唷,(~˘▾˘)~',
        path: '/pages/public/public?keyword='+GLOBAL_PAGE.data.keyword
      }
  },
  
  //后台更新页脚
  adTitleText:function(){
      wx.request({
        url: Api.adTitle(), //查询Tag
        method:"GET",
        success: function(res) {
          var object = res.data
          if(object.status == "true"){
                GLOBAL_PAGE.setData({
                    titleText:object.title,
                    keyword:object.keyword,
                    searchKey:object.search_key
                })
          }
        },
        complete:function(){
             GLOBAL_PAGE.searchBtn() //搜索完成
        }
    })
  },

  onLoad: function (options) {
    GLOBAL_PAGE = this
    //1 page初始化高宽
    console.log("width:" , APP.globalData.windowWidth)
    console.log("height:" , APP.globalData.windowHeight - 84)
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 90, //搜索框高度48px,短语框高度42px
    })

    if( options.keyword != null && options.keyword != "" && options.keyword != undefined )
        GLOBAL_PAGE.setData({
            keyword:options.keyword,
        })
    

    //从分享页面进入public，session为空，先登录
    var session = wx.getStorageSync(KEY.session) 
    if(session == "")
         GLOBAL_PAGE.login()
    
  
    //获取表情列表
     wx.request({
        url: Api.tagQuery(), //查询Tag
        method:"GET",
        data: {
          session: "ds9"
        },
        success: function(res) {
          var object = res.data
          if(object.status == "true"){
              GLOBAL_PAGE.setData({category:res.data.category_list})
              GLOBAL_PAGE.createTag(res.data.category_list)
              var c_list = []
              for (var i=0;i< res.data.category_list.length;i++)
              {
                  c_list.push(res.data.category_list[i].name)  
              }
              
              GLOBAL_PAGE.adTitleText() //获取广告信息
              
          }
          else
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
          
        },
        fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        complete:function(){
            GLOBAL_PAGE.setData({
              indexShow:false,
              shortcutShow:true,
              emoticonShow:true,
              loadShow:false,
            }) 
        }
    })
  },
  
  login:function(){
     //2 user loginlogin
     
    console.log("session:", wx.getStorageSync('session') )
    wx.login
    ({
        success: function (res) 
        {
          
          var _session = wx.getStorageSync('session') 
          if (! _session  ) //检查session,不存在，为false
            _session = "false"
         
          var url = Api.userLogin()
          console.log(res.code)
          wx.request
          ({  
            url: url, 
            method:"GET",
            data:{
              js_code:res.code,
              session:_session,
            },
            success: function(res)
            {
              console.log("success:")
              console.log(res)
              if (res.data.status == "true") //登陆成功
              {
                wx.setStorageSync('session', res.data.session)
                //Todo 初始化页面、目录
                // GLOBAL_PAGE.onInit()
              }
              else
                wx.showModal({
                  title: '网络连接失败，是否重新登陆？',
                  content:"请确认网络是否正常,可进入“我的”重新登录",
                  confirmText:"重新登陆",
                  success: function(res) {
                      if (res.confirm) {
                          GLOBAL_PAGE.login()
                      }
                  }
                })                
            },
            fail:function(res) { 
                wx.showModal({
                  title: '网络连接失败，是否重新登陆？',
                  content:'请确认网络是否正常,可进入“我的”重新登录',
                  confirmText:"重新登陆",
                  success: function(res) {
                      if (res.confirm) {
                          GLOBAL_PAGE.login()
                      }
                  }
                }) 
            },
          })
        }
    });
  },
})
