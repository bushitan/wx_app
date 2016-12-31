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

    displayLoading: true,
    keyword:"老司机", //搜索关键字
    // emoticon: [],
    hotLabel:["金馆长","我想静静","意外","疼！"],  
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
     searchKey:["搞笑","运动","笑屎了","老司机"],
     searchResultShowed:false,
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
    Render.share(current,urls)
  },

  // 5 菜单收藏按钮，可以收藏多张 
  menuCollect:function(){
   // Todo 去除重复搜藏
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

                  wx.showToast({
                      title: '收藏成功',
                      icon: 'success',
                      duration: 700
                  })
              }
          },
          fail:function(res){
            console.log("collect fail:",res.data)
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

 
  renderEmoticon:function(emoticon){
    Render.emoticon(GLOBAL_PAGE,emoticon)
  },

//   onShareAppMessage: function () {
//     return {
//       title: '自定义分享标题',
//       desc: '自定义分享描述',
//       path: '/page/user?id=123'
//     }
//   },
  
  //搜索栏
  /**
  * 1 根据keyword，搜索
  */
  searchBtn:function(){
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


    var _keyword = GLOBAL_PAGE.data.keyword
    var url = Api.tagImgQuery() 
    var session = wx.getStorageSync(KEY.session) 
    //获取表情列表
     wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: session,
          tag_name : _keyword,
          // category_id: '1',
          // category_name: _keyword,
        },
        success: function(res) {
          var object = res.data
          GLOBAL_PAGE.renderEmoticon(object.img_list)
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
    
    GLOBAL_PAGE.setData({
      keyword:e.currentTarget.dataset.keyword,
      // inputVal:e.currentTarget.dataset.keyword,
      inputShowed:true,
      searchResultShowed:false,
    })

    //index目录列表
    //临时建立tagListDisplay中间选项，首页查询，所有tag一起展示，
    if(e.currentTarget.dataset.keyword == "首页")
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
          keyword: "",
          inputShowed: false
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

  
  onLoad: function () {
    GLOBAL_PAGE = this
    //1 page初始化高宽
    console.log("width:" , APP.globalData.windowWidth)
    console.log("height:" , APP.globalData.windowHeight - 84)
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 90, //搜索框高度48px,短语框高度42px
    })

   
  
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
     
              GLOBAL_PAGE.searchBtn() //搜索完成
          }
          
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
  
})
