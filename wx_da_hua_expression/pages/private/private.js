// private.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');
var Render = require('../../utils/render.js');
var Key = require('../../utils/storage_key.js');

var APP = getApp()
var GLOBAL_PAGE
var appInstance
Page({
  data: {
    //loading框
    hidden: false,

    //点击弹出菜单
    displayMenu:false,

    //控制菜单上架
    menuType:"m-down",  //m-up  m-down

    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,

    //页面渲染数据
    emoticon:[],
    category:[],

    //touch选择对象
    selectEmoticon:{id:"",name:"",img_url:""}, //预备编辑的图片
    selectCategory:{id:"",name:""},

    w:0,
    h:0,
  },

  /** No.2
   * Page:private 基础事件
   * 1、wxml的catchtap全触发eventBase
   * 2、eventDisplay:执行view的显示/隐藏
   * 3、eventListen:根据data-actiondata-action，确定执行的事件
   */
  eventBase:function(e){
    GLOBAL_PAGE.eventListen(e)
    GLOBAL_PAGE.eventDisplay(e.currentTarget.dataset.action)
  },

  /**No2.1
   * 触发view的隐藏显示
   */
  eventDisplay:function(action){
    var _display = {
      "navigateToCategory":function(){View.Switch.Off("displayCategory","displayMask")},//设置目录，关闭目录、遮罩
      "navigateToPainter":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传图片，关闭上传、遮罩
      // 表情功能菜单
      "onMenu":function(){ View.Switch.On("displayMenu") },//btn打开菜单
      "navigateToEditor":function(){ View.Switch.Off("displayMenu") },
      "menuMoveCategory":function(){ View.Switch.OffAll() },
      //基本view:遮罩、All
      "mask":function(){View.Switch.OffAll()}, //公共透明遮罩
      "all":function(){View.Switch.Off("displayMenu")}, //公共透明遮罩
    }
    if (_display.hasOwnProperty(action))
      _display[action]()
    View.Switch.Work() //触发效果
  },
  eventListen:function(e){

    var _eventDict = {
      "navigateToCategory":GLOBAL_PAGE.navigateToCategory,
      "navigateToPainter": GLOBAL_PAGE.navigateToPainter,
      "navigateToEditor": GLOBAL_PAGE.navigateToEditor,
      "onMenu": GLOBAL_PAGE.onMenu,
      "menuShare": GLOBAL_PAGE.menuShare,
      "menuDelete": GLOBAL_PAGE.menuDelete,
      "menuMoveCategory": GLOBAL_PAGE.menuMoveCategory,
      "menuResizeV2": GLOBAL_PAGE.menuResizeV2,
      "btnUploadV2":GLOBAL_PAGE.btnUploadV2,
      "selectCategory":GLOBAL_PAGE.selectCategory,
      "selectAllCategory":GLOBAL_PAGE.selectAllCategory,
      "scrollTolower":GLOBAL_PAGE.scrollTolower,
    }

    if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
      _eventDict[e.currentTarget.dataset.action](e) 
  },

  /** 1 选择所有目录 */
  selectAllCategory:function(){
    //选择全部，category_id == null
    GLOBAL_PAGE.setData({
      selectCategory:{category_id:null },
    })
    GLOBAL_PAGE.renderEmoticon()
  },

  /** 2 选择指定目录 */
  selectCategory:function(e){
    var c_id = e.currentTarget.dataset.select_category_id
    //改变目录
    GLOBAL_PAGE.setData({
      selectCategory:{category_id:c_id },
    })
    //根据emoticone，更新表情
    GLOBAL_PAGE.renderEmoticon()

  },


/** 3 Todo
     * 1、传入该分类的总张数
     * 2、设置已获取张渚
     * 3、设置准备获取数量
     * 4、当准备获取量为0，提示"图片加载完毕"
     *  */
  scrollTolower:function(){
    console.log("scrollTolower")
  },

   //新开发 目录最后点击“+”开关
  btnUploadV2:function() {
     wx.showActionSheet({
      itemList: ['图片(GIF需要原图)', '小视频'],
      success: function(res) {
        
        console.log(res)
        if (!res.cancel) {
          console.log(res.tapIndex)
          switch(res.tapIndex){
            case "0" :  GLOBAL_PAGE.uploadImage();break;
            case "1" :  GLOBAL_PAGE.uploadVideo();break;
          }
          
        }
      }
    })

  },

  //上传图片
  uploadImage:function() {
    
    console.log("chooseImage")
    //上传图片
    wx.chooseImage({
      count: 1, 
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: Api.uploadImg(), 
          filePath: tempFilePaths[0],
          name: 'file',
          header: {  
            "Content-Type": "multipart/form-data"  
          },
          formData:{
            'session': wx.getStorageSync(Key.session)
          },
          success: function(res){
            var data = JSON.parse(res.data)
            if(data.status == "true")
            {
              var e = wx.getStorageSync(Key.emoticon)
              e.push(data.img)
              wx.setStorageSync(Key.emoticon,e)
              GLOBAL_PAGE.renderEmoticon()

              wx.showToast({
                  title: '上传图片成功',
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
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  
  //选择视频
  uploadVideo : function() {
  },
 
  /** 4 打开菜单 */
  onMenu: function(e) {
    //准备当前预备编辑的图片地址
    GLOBAL_PAGE.setData({
      selectEmoticon:{
        id: e.currentTarget.dataset.id, 
        img_url:e.currentTarget.dataset.img_url,
        category_id:e.currentTarget.dataset.category_id,
        }
    })

    if (e.currentTarget.offsetTop < 200)
       GLOBAL_PAGE.setData({menuType:"m-down"})
    else
       GLOBAL_PAGE.setData({menuType:"m-up"})

  },
  /** 5 菜单-分享 */
  menuShare:function(){
    Menu.Option.Share( GLOBAL_PAGE.data.selectEmoticon )
  },

  /** 6 菜单-裁剪 */
  menuResizeV2:function(){
    wx.showActionSheet({
      itemList: ['大图(170x170)', '中图(128x128)', '小图(96x96)', '炒鸡小(48x48)'],
      success: function(res) {
        if (!res.cancel) {
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
                      img_id: GLOBAL_PAGE.data.selectEmoticon.id,
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
                        }
                    }
                })
            }
            /**
             * Todo 与后台确认删除表情
             */
        }   
    })
    //删除后，menu框隐藏
  },

  /** 8 菜单-分组 */
  menuMoveCategory:function(){
    var list = []
    for (var i=0;i<GLOBAL_PAGE.data.category.length;i++)
      list.push(GLOBAL_PAGE.data.category[i].name)
    //竖排列表选取
    wx.showActionSheet({
      itemList: list,
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)

          var a = GLOBAL_PAGE.data.category[res.tapIndex] 
          //移动表情
          wx.request({
              url: Api.imgMove() , 
              method:"GET",
              data: {
                session: wx.getStorageSync(Key.session),
                img_id: GLOBAL_PAGE.data.selectEmoticon.id,
                old_category_id:GLOBAL_PAGE.data.selectEmoticon.category_id,
                new_category_id: GLOBAL_PAGE.data.category[res.tapIndex].category_id,
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
                      duration: 100
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
        }
      }
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
    console.log("height:" , APP.globalData.windowHeight - 48)
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 48,
      // windowHeight:app.globalData.windowHeight - 48,
    })
    //测试session
    wx.setStorageSync('session',"ds9") 
    //测试登陆
    // GLOBAL_PAGE.loginTest()

    //正式登陆
    GLOBAL_PAGE.login()

    // // 300ms后，隐藏loading
    setTimeout(function() {
          GLOBAL_PAGE.setData({
            hidden: true
          })
    }, 300)
  },

  //登陆测试
  loginTest:function(){
    //临时表情
    var e =  [
      {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    {img_id: 4, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135650.jpeg"},
      {img_id: 5, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135820.gif"},
      {img_id: 6, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135856.gif"},
      {img_id: 7, category_name: "默认目录", size: 170, category_id: 1, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106143937.jpeg"},
      {img_id: 2, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135136.jpeg"},
      {img_id: 3, category_name: "管理的哈哈", size: 170, category_id: 14, yun_url: "http://7xsark.com1.z0.glb.clouddn.com/0_20161106135420.jpeg"},
    ]
    wx.setStorageSync("emoticon",e)
    GLOBAL_PAGE.renderEmoticon()

    var c = [
      {is_default: 1, hasImg: true, category_id: 1, name: "默认目录"},
      {is_default: 0, hasImg: true, category_id: 14, name: "管理的哈哈"},
    ] 
    wx.setStorageSync("category",c)
    GLOBAL_PAGE.renderCategory()   
  },

  login:function(){
     //2 user loginlogin
     
    console.log( wx.getStorageSync('session') )
    wx.login
    ({
        success: function (res) 
        {
          var _session = wx.getStorageSync('session') 
          if (! _session  ) //检查session,不存在，为false
            _session = "false"
          var url = Api.userLogin()
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
              
              console.log(res)
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
  navigateToEditor: function(e) {
    var url = '../watermark/watermark?imgurl=' + GLOBAL_PAGE.data.selectEmoticon;
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
  bindload:function(e){
    console.log(e)

    var new_h = parseInt( e.detail.height*680/e.detail.width)
     
    GLOBAL_PAGE.setData({
      
      w:e.detail.width,
      h:new_h
      })
  },
  heng:function(e){
    var new_w = parseInt( e.detail.width/e.detail.height * 450)
     
    GLOBAL_PAGE.setData({
      w:new_w
      })
  },
})





