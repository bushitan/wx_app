// private.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');
var Render = require('../../utils/render.js');
var Key = require('../../utils/storage_key.js');

var APP = getApp()
var GLOBAL_PAGE
var appInstance
var i = 0
Page({
  data: {
    pageName: "private",
    //loading框
    loadShow: true,
    
    //显示控制
    isUpload:false,
    selectCategoryShow:false,
    joinShow:false, //显示拼接框

    // 上传图片数量
    uploadNum:{count:9,finish:0},

    //join数据
    joinImg:{
      step:1,
      status:1, // 1 准备状态 2 用户已操作 3 正在上传 
      first:"http://image.12xiong.top/12_20161226084253.gif?imageMogr2/thumbnail/170x170",
      seconde:"http://image.12xiong.top/12_20161226084358.gif?imageMogr2/thumbnail/170x170",
      resualt:"http://image.12xiong.top/12_20161226084407.gif?imageMogr2/thumbnail/170x170",
      resualt_alert:"http://image.12xiong.top/12_20161226084358.gif?imageMogr2/thumbnail/170x170",
    },

    //video 控制
    startTime:0,
    durationTime:6,

    // 控制菜单上架
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

    //touch选择对象
    selectEmoticon:{id:"",name:"",img_url:"",size:""}, //预备编辑的图片
    selectCategory:{id:"",name:""},
    
  },


  //1 关闭所有悬浮框
  hiddenAll:function(){GLOBAL_PAGE.setData({menuType:0})},


  /**2 选择指定目录 */
  selectCategory:function(e){
    GLOBAL_PAGE.hiddenAll()//清除屏幕框
    var c_id = e.currentTarget.dataset.select_category_id
    if (c_id == "") c_id = null  //c_id为空，全选
    GLOBAL_PAGE.setData({
      selectCategory:{ //改变目录
        category_id:c_id
      },
    })
    //根据emoticone，更新表情
    GLOBAL_PAGE.renderEmoticon()
  },


/** 3 表情滚动条
     * 1、传入该分类的总张数
     * 2、设置已获取张渚
     * 3、设置准备获取数量
     * 4、当准备获取量为0，提示"图片加载完毕"
     *  */
  emoticonScrollTolower:function(){
    console.log("scrollTolower")
  },

  //上传大类 4-1
  btnUpload:function() {
     wx.showActionSheet({
      itemList: ['图片(GIF需要原图)', '小视频'],
      success: function(res) {
        if (!res.cancel) {
          if(res.tapIndex == 0 || res.tapIndex =='0')
            GLOBAL_PAGE.uploadQiniuImage()
          if(res.tapIndex == 1 || res.tapIndex =='1')
            GLOBAL_PAGE.uploadQiniuVideo()  
        }
      }
    })
  },
//正在上传 4-2
  btnIsUpload:function() {
    wx.showToast({
        title: '正在上传',
        icon: 'loading',
        duration: 700
    })
  },
  //传图片 4-3
  uploadQiniuImage:function(){
      wx.chooseImage({
        count: 9, 
        success: function(res) {
            GLOBAL_PAGE.uploadPrepare(1,res.tempFilePaths)
            var tempFilePath = res.tempFilePaths[0] //图片            
            GLOBAL_PAGE.uploadFile(tempFilePath)
        },
        fail:function(res){
          console.log(res)
        }
      })
  },
  //传视频 4-4
  uploadQiniuVideo:function(){
      wx.chooseVideo({
        sourceType: ['album','camera'],
        maxDuration: 60,
        camera: ['front','back'],
        success: function(res) {
            GLOBAL_PAGE.uploadPrepare(2,res.tempFilePath)
            var tempFilePath = res.tempFilePath //小视频
            GLOBAL_PAGE.uploadFile(tempFilePath)
        },
        fail:function(res){
          console.log(res)
        }
      })
  },

  //上传预处理 4-5
  uploadPrepare:function(method,path){
    var _method = method
    var _path = path
    var _count
    if (_method == 1) // 上传图片
        _count = _path.length
    if (_method == 2) // 上传视频 
    {
        _count = 1
        _path = [_path] //视频、图片地址，均按数组传递
    }
     if(_count <= 0)  console.log("上传数量出错")  
     GLOBAL_PAGE.setData({
        isUpload:true,//设置上传状态
        uploadNum:{
          path:_path,
          count:_count,//设置上传数量 
          finish:0
        }
      })
  },
  //上传完成 4-6
  uploadCompelte:function(){
      var _uploadNum = GLOBAL_PAGE.data.uploadNum
      var _count = _uploadNum.count
      var _finish = _uploadNum.finish
      _finish++ 
      _uploadNum.finish = _finish
      GLOBAL_PAGE.setData({
        uploadNum:_uploadNum
      })
      if(_count == _finish)
      {
        GLOBAL_PAGE.setData({isUpload:false})
        wx.showToast({
            title: '上传完成，添加至默认目录',
            icon: 'success',
            duration: 700
        })
      }
      else
        console.log( GLOBAL_PAGE.data.uploadNum)
        GLOBAL_PAGE.uploadFile( GLOBAL_PAGE.data.uploadNum.path[_finish])
        //todo 上传函数
  },
  //正式上传 4-7
  uploadFile:function(file_path){
      var _type = file_path.split(".").pop()
      console.log(file_path)
      wx.request({
          url: Api.uploadToken(), 
          data:{
            'session': wx.getStorageSync(Key.session),
            "type":_type,
          },
          success: function(res){
              var data = res.data
              console.log(data)
              if(data.status == "true")
              {
                  wx.uploadFile({
                      url: 'https://up.qbox.me',
                      // filePath: tempFilePaths[0],//图片
                      filePath: file_path,//小视频
                      name: 'file',
                      formData:{
                        'key': data.key,
                        'token': data.token,
                      },
                      success: function(res){
                        console.log("上传成功")
                        var data = JSON.parse(res.data);
                        console.log(data)
                        if(data.status == "true")
                        {
                          var e = wx.getStorageSync(Key.emoticon)
                          e.push(data.img)
                          wx.setStorageSync(Key.emoticon,e)
                          GLOBAL_PAGE.renderEmoticon()
                        } 
                      },
                      fail (error) {
                        console.log(error)
                      },
                      complete (res) {
                        console.log(res)
                        GLOBAL_PAGE.uploadCompelte()
                      }
                  })
              } 
          },
          fail:function(res){
              var data = res.data
              console.log(res)
          },
          complete:function(res) { 
          },
      })
  },

  /** 4 打开菜单 */
  onMenu: function(e) {
    //准备当前预备编辑的图片地址
    GLOBAL_PAGE.setData({
      selectEmoticon:{
        img_id: e.currentTarget.dataset.img_id, 
        img_url:e.currentTarget.dataset.img_url,
        category_id:e.currentTarget.dataset.category_id,
        size:e.currentTarget.dataset.size,
        static_url:e.currentTarget.dataset.static_url,
        yun_url:e.currentTarget.dataset.yun_url,
        width:e.currentTarget.dataset.width,
        height:e.currentTarget.dataset.height,
        duration:e.currentTarget.dataset.duration,
        },
      menuType: e.currentTarget.dataset.menu_type
    })
  },

  /** 5 菜单-分享 */
  menuShare:function(){
    // Menu.Option.Share( GLOBAL_PAGE.data.selectEmoticon )

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

  /** 6 菜单-裁剪 */
  menuResizeV2:function(){
    wx.showActionSheet({
      itemList: ['大图(170x170)', '中图(128x128)', '小图(96x96)', '炒鸡小(48x48)'],
      success: function(res) {
        if (!res.cancel) {
          wx.showToast({
              title: '压缩成功，分享试试',
              icon: 'success',
              duration: 700
          })
          // console.log(res.tapIndex)
          //Todo 上传
          var _new_img = GLOBAL_PAGE.data.selectEmoticon
          GLOBAL_PAGE.emoticonUpdate(_new_img)
        }
      }
    })
  },

  /** 7 菜单-删除 */
  menuDelete:function(){
    var url = Api.imgDelete() 
    wx.showModal({
        title: '是否删除表情',
        content: ' ',
        success: function(res) {
            if (res.confirm) {
                wx.request({
                    url: Api.imgDelete() , 
                    method:"GET",
                    data: {
                      session: wx.getStorageSync(Key.session),
                      img_id: GLOBAL_PAGE.data.selectEmoticon.img_id,
                      category_id:GLOBAL_PAGE.data.selectEmoticon.category_id,
                    },
                    success: function(res) {
                        var object = res.data
                        if (object.status == "true")
                        {
                           //删除成功，去掉数组元素
                            var img_id = parseInt(object.img_id)
                            var category_id = parseInt(object.category_id)
                            var e = wx.getStorageSync(Key.emoticon)
                            for ( var i=0;i<e.length;i++)
                            {
                              if ( e[i].img_id == img_id && e[i].category_id == category_id )
                              {
                                  e.splice(i,1)
                                  break
                              }
                            }
                          
                            //更新emotion
                            wx.setStorageSync(Key.emoticon,e)
                            GLOBAL_PAGE.renderEmoticon()

                            wx.showToast({
                                title: '修改分组成功',
                                icon: 'success',
                                duration: 700
                            })
                            GLOBAL_PAGE.setData({menuType:0})
                        }
                    }
                })
            }
            /**
             * Todo 与后台确认删除表情
             */
        },
        complete:function(res) { 
          
        }
    })
    //删除后，menu框隐藏
  },

  /** 8 菜单-分组 */
  menuMoveCategory:function(){
    var list = []
    for (var i=0;i<GLOBAL_PAGE.data.category.length;i++)
      list.push(GLOBAL_PAGE.data.category[i].name)

    if (list.length ==  1) //只有1个组，提示增加分组
    {
        wx.showToast({
            title: '请按右上角 + 添加分组',
            icon: 'loading',
            duration: 1000
        })
        return 
    }

    if (list.length <= 6 )
    {
        //竖排列表选取
        wx.showActionSheet({
          itemList: list,
          success: function(res) {
            if (!res.cancel) {
              console.log(res.tapIndex)
              var a = GLOBAL_PAGE.data.category[res.tapIndex] 
              GLOBAL_PAGE.moveCategory(res.tapIndex)
            }
          }
        })
    }
    else{
      GLOBAL_PAGE.setData({selectCategoryShow:true}) 
    }
   
  },
  
  closeMove:function(){
    GLOBAL_PAGE.setData({selectCategoryShow:false}) 
  },

  buttonMove:function(e){
    var index = parseInt( e.currentTarget.dataset.index )
    GLOBAL_PAGE.moveCategory(index)
    GLOBAL_PAGE.setData({selectCategoryShow:false}) 
  },

  moveCategory:function(tapIndex){
    //移动表情
          wx.request({
              url: Api.imgMove() , 
              method:"GET",
              data: {
                session: wx.getStorageSync(Key.session),
                img_id: GLOBAL_PAGE.data.selectEmoticon.img_id,
                old_category_id:GLOBAL_PAGE.data.selectEmoticon.category_id,
                new_category_id: GLOBAL_PAGE.data.category[tapIndex].category_id,
              },
              success: function(res) {
                var object = res.data
                if (object.status == "true")
                {
                  var img_id = parseInt(object.img_id)
                  var category_id = parseInt(object.category_id)
                  var e = wx.getStorageSync(Key.emoticon)
                  for ( var i=0;i<e.length;i++)
                  {
                    if ( e[i].img_id == img_id )
                      e[i].category_id = category_id
                  }

                  //更新emotion
                  wx.setStorageSync(Key.emoticon,e)
                  GLOBAL_PAGE.renderEmoticon()

                   wx.showToast({
                      title: '修改分组成功',
                      icon: 'success',
                      duration: 500
                  })
                }
                else{
                  wx.showToast({
                      title: '图片已在该目录',
                      icon: 'success',
                      duration: 700
                  })
                }
               
              }
            })
  },


  starTimeChange:function(e){
    GLOBAL_PAGE.setData({
      startTime:e.detail.value 
    })
  },

  durationTimeChange:function(e){
     GLOBAL_PAGE.setData({
      durationTime:e.detail.value 
    })
  },
   
  /** 8 菜单-视频转GIF */
  menuVideo2Gif:function(){
      //改变上传btn状态为
      GLOBAL_PAGE.setData({isUpload:true})
      
      wx.request({
          url: Api.imgVideo2gif(), 
          data:{
            'session': wx.getStorageSync(Key.session),
            "video_url":GLOBAL_PAGE.data.selectEmoticon.img_url,
            "start_time":GLOBAL_PAGE.data.startTime,
            "duration_time":GLOBAL_PAGE.data.durationTime,
          },
          success: function(res){
              var data = res.data
              console.log(data)
              if(data.status == "true")
              {
                var e = wx.getStorageSync(Key.emoticon)
                e.push(data.img)
                wx.setStorageSync(Key.emoticon,e)
                GLOBAL_PAGE.renderEmoticon()

                wx.showToast({
                    title: '视频转Gif成功',
                    icon: 'success',
                    duration: 700
                })
              } 
          },
          fail:function(res){
              console.log("chooseImage fail")
              var data = res.data
              console.log(res)
          },
          complete:function(res) { 
              GLOBAL_PAGE.setData({isUpload:false})
          },
      })
  },

  /** 9 join 拼接 */
  menuJoin:function(){
      GLOBAL_PAGE.setData({joinShow:true})
  },

  //10 设置join的的1，2幅图片
  joinSet:function(e){
      var action  = e.currentTarget.dataset.action
      var joinImg = GLOBAL_PAGE.data.joinImg 
      var select = GLOBAL_PAGE.data.selectEmoticon 



      if (joinImg.status == 1)
          joinImg.status = 2
      if (action == "1"){
          if ( select.img_url == joinImg.seconde)
              change()
          else
              joinImg.first = select.img_url
      }
          
      if (action == "2") 
          if ( select.img_url == joinImg.first)
              change()
          else
              joinImg.seconde = select.img_url
      
      GLOBAL_PAGE.setData({joinImg:joinImg})

      //交换图片1和2的位置
      function change(){
          var temp = joinImg.first
          joinImg.first = joinImg.seconde
          joinImg.seconde = temp
      }
  },

  joinCancel:function(){
      GLOBAL_PAGE.setData({joinShow:false})
  },
  joinConfirm:function(){
    if(GLOBAL_PAGE.data.isUpload == true)
    {
      wx.showToast({
          title: '任务正在上传中，请等待',
          icon: 'success',
          duration: 700
      })
      return
    }
    
    GLOBAL_PAGE.setData({isUpload:true}) //打开上传

    wx.request({
        url: Api.editorJoin(), 
        data:{
          'session': wx.getStorageSync(Key.session),
          "first":GLOBAL_PAGE.data.joinImg.first,
          "seconde":GLOBAL_PAGE.data.joinImg.seconde,
        },
        success: function(res){
            var data = res.data
            console.log(data)
            if(data.status == "true")
            {
              //渲染图片
              var e = wx.getStorageSync(Key.emoticon)
              e.push(data.img)
              wx.setStorageSync(Key.emoticon,e)
              GLOBAL_PAGE.renderEmoticon()

              //成功显示图片
              var joinImg = GLOBAL_PAGE.data.joinImg 
              joinImg.resualt =  data.img.yun_url
              GLOBAL_PAGE.setData({joinImg:joinImg})

              wx.showToast({
                  title: '拼接成功,保存在默认目录',
                  icon: 'success',
                  duration: 700
              })
            } 
        },
        fail:function(res){
            console.log("chooseImage fail")
            var data = res.data
            console.log(res)
            wx.showToast({
                title: '网路连接失败，请重试',
                icon: 'success',
                duration: 700
            })
        },
        complete:function(res) { 
            GLOBAL_PAGE.setData({isUpload:false})
        },
    })
  },


  onHide:function(){
    View.Switch.OffAll()
    View.Switch.Work()
  },

  // Render:function(){
  //    //2 初始化本地表情表
  //    Render.emoticon(this,wx.getStorageSync("emoticon"))
  //   //3 初始化目录
  //    Render.category(this,wx.getStorageSync("category"))
  // },

  /**渲染表情 */
  renderEmoticon:function(){
    //根据条件选择emoticon，重新渲染
    var c_id = GLOBAL_PAGE.data.selectCategory.category_id 
    var e_storage = wx.getStorageSync(Key.emoticon) //存储
    var e_render = [] //预渲染
    if ( c_id == undefined || c_id == null)
    {
       e_render = e_storage
    } else
    {
      for (var i=0;i<e_storage.length;i++)
      {
        if(e_storage[i].category_id == c_id)
          e_render.push(e_storage[i])
      }
    }
     
    Render.emoticon(this,e_render)
  },
 
  /**渲染表情 */
  renderCategory:function(){
    Render.category(this,wx.getStorageSync("category"))
  },

  onShow: function() {
    //菜单显示框
    var _view = {
      displayMenu:false,
    }
    View.Switch.Init(this,_view)
    View.Switch.Work()

    //渲染表情和目录
    GLOBAL_PAGE.renderEmoticon()
    GLOBAL_PAGE.renderCategory()
  },

  
  /**
   * 加载完毕，更新图片
   */
  onReady:function(){
    // Menu.Option.GetPictureMy(GLOBAL_PAGE.callBack)  //临时删除
    
  },


  /**
   *  页面加载
   */
  onLoad: function (param) {    
    GLOBAL_PAGE = this
    //1 page初始化高宽
    console.log("width:" , APP.globalData.windowWidth)
    console.log("height:" , APP.globalData.windowHeight)
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 42,  //category框高度42px
      // windowHeight:APP.globalData.windowHeight - 84,  //category框高度42px
      // windowHeight:app.globalData.windowHeight - 48,
    })
    //测试session
    // wx.setStorageSync('session',"ds9") 
    // wx.setStorageSync('session',"") 
    console.log("session:", wx.getStorageSync('session') )

    //正式登陆
    GLOBAL_PAGE.login()


    
    // // 300ms后，隐藏loading
    setTimeout(function() {
          GLOBAL_PAGE.setData({
            loadShow: false
          })
    }, 500)
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
                GLOBAL_PAGE.onInit()
              }
                
              else
                wx.showToast({
                  title: '登陆失败',
                  icon: 'loading',
                  duration: 1000
                })              
            },
            fail:function(res) { 
              
              console.log("fail:",res)
             wx.showToast({
                  title: '网络连接失败',
                  icon: 'loading',
                  duration: 1000
                })    
            },
            complete:function(res) { 
              console.log("private complete")
              console.log(res)
            },
          })
        }
    });
  },
  //Page：private  初始化页面的钩子
  onInit:function( ){
    //数据初始化 图片
    var that = this;
    var url = Api.imgQuery() 

    var session = wx.getStorageSync(Key.session) 
    if (! session  ) //检查session,不存在，为false
      session = "false"

    //获取表情列表
     wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: session,
          category_id: 'null',
        },
        success: function(res) {
          var object = res.data
          wx.setStorageSync(
              Key.emoticon,
              object.img_list
          )
          GLOBAL_PAGE.renderEmoticon()
        }
      })

     //数据初始化 目录
      url = Api.categoryQuery() 
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: session,
        },
        success: function(res) {
          var object = res.data
          wx.setStorageSync(
              Key.category,
              object.category_list
          )
          GLOBAL_PAGE.renderCategory()
        }
      })
    
  },

   //导航：水印页面
  navigateToWatermark: function(e) {
    var url = '../watermark/watermark?imgurl=' + GLOBAL_PAGE.data.selectEmoticon.yun_url 
    + "&width=" + GLOBAL_PAGE.data.selectEmoticon.width 
    + "&height=" + GLOBAL_PAGE.data.selectEmoticon.height 

    wx.navigateTo({
      url: url
    })
  },

  //导航：gif拼接页面
  navigateToJoin: function(e) {
    var url = '../join/join?imgurl=' + GLOBAL_PAGE.data.selectEmoticon;
    wx.navigateTo({
      url: url
    })
  },
  
  //导航：目录设置页面
  //param 当前目录
  navigateToCategory: function(e) {
    //Todo 关闭所有页面
    var url = '../category/category'
    wx.navigateTo({
      url: url
    })
  },

  //导航：目录设置页面
  navigateToPainter: function(e) {
    var url = '../painter/painter'
    wx.navigateTo({
      url: url
    })
  },


  //图片加载完毕
  bindloadVertical:function(e){
    Render.menu.vertical(GLOBAL_PAGE,e)

  },
  bindloadHorizontal:function(e){    
    Render.menu.horizontal(GLOBAL_PAGE,e)
  },
})




