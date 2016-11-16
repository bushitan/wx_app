// private.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');
var Render = require('../../utils/render.js');

var app = getApp()
var global_page
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

  },

  /** No.2
   * Page:private 基础事件
   * 1、wxml的catchtap全触发eventBase
   * 2、eventDisplay:执行view的显示/隐藏
   * 3、eventListen:根据data-actiondata-action，确定执行的事件
   */
  eventBase:function(e){
    global_page.eventListen(e)
    global_page.eventDisplay(e.currentTarget.dataset.action)
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
      "navigateToCategory":global_page.navigateToCategory,
      "navigateToPainter": global_page.navigateToPainter,
      "navigateToEditor": global_page.navigateToEditor,
      "onMenu": global_page.onMenu,
      "menuShare": global_page.menuShare,
      "menuDelete": global_page.menuDelete,
      "menuMoveCategory": global_page.menuMoveCategory,
      "menuResizeV2": global_page.menuResizeV2,
      "btnUploadV2":global_page.btnUploadV2,
      "selectCategory":global_page.selectCategory,
      "selectAllCategory":global_page.selectAllCategory,
      "scrollTolower":global_page.scrollTolower,
    }

    if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
      _eventDict[e.currentTarget.dataset.action](e) 
  },

  /** 1 选择所有目录 */
  selectAllCategory:function(){
    var e = wx.getStorageSync("emoticon")
      
    Render.emoticon(global_page,e)
  },

  /** 2 选择指定目录 */
  selectCategory:function(e){
    //改变目录
    global_page.setData({
      selectCategory:{id: e.currentTarget.dataset.select_id},
    })

    //根据emoticone，更新表情
    var e_list = wx.getStorageSync("emoticon")
    var new_list = []
    for (var i = 0; i<e_list.length;i++)
      if(e_list[i].category_id == global_page.data.selectCategory.id)
        new_list.push(e_list[i])
    
    Render.emoticon(global_page,new_list)
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
        if (!res.cancel) {
          // console.log(res.tapIndex)
          //Todo 上传
          var _new_img = global_page.data.selectEmoticon
          global_page.emoticonUpdate(_new_img)
        }
      }
    })

  },

  //上传图片
  uploadImage:function() {
  },
  
  //选择视频
  uploadVideo : function() {
  },
 
  /** 4 打开菜单 */
  onMenu: function(e) {
    //准备当前预备编辑的图片地址
    global_page.setData({
      selectEmoticon:{id: e.currentTarget.dataset.id, img_url:e.currentTarget.dataset.img_url}
    })

    if (e.currentTarget.offsetTop < 200)
       global_page.setData({menuType:"m-down"})
    else
       global_page.setData({menuType:"m-up"})

  },
  /** 5 菜单-分享 */
  menuShare:function(){
    Menu.Option.Share( global_page.data.selectEmoticon )
  },

  /** 6 菜单-裁剪 */
  menuResizeV2:function(){
    wx.showActionSheet({
      itemList: ['大图(170x170)', '中图(128x128)', '小图(96x96)', '炒鸡小(48x48)'],
      success: function(res) {
        if (!res.cancel) {
          // console.log(res.tapIndex)
          //Todo 上传
          var _new_img = global_page.data.selectEmoticon
          global_page.emoticonUpdate(_new_img)
        }
      }
    })
  },

  /** 7 菜单-删除 */
  menuDelete:function(){
    Menu.Option.Delete(global_page.callBack)
    //删除后，menu框隐藏
  },

  /** 8 菜单-分组 */
  menuMoveCategory:function(){
    wx.showActionSheet({
      itemList: global_page.data.category,
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          
          var url = Api.categoryMove() 
          var session = wx.getStorageSync('session') 
          //获取表情列表
          wx.request({
              url: url, //仅为示例，并非真实的接口地址
              method:"POST",
              data: Api.json2Form({
                session: session,
                img_id: global_page.data.selectEmoticon.id,
                category_id: 'null',
              }),
              header: {  
                "Content-Type": "application/x-www-form-urlencoded"  
              },
              success: function(res) {
                var object = res.data
                wx.setStorageSync(
                    "emoticon",
                    object.img_list
                )
                Render.emoticon(global_page,object.img_list)
              }
            })
          console.log("storyge" );
        }
      }
    })
  },

  onHide:function(){
    View.Switch.OffAll()
    View.Switch.Work()
  },

  Render:function(){
     //2 初始化本地表情表
     Render.emoticon(this,wx.getStorageSync("emoticon"))
    //3 初始化目录
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
    global_page.Render()
   
     //4 初始化选择目录
  },

  
  /**
   * 加载完毕，更新图片
   */
  onReady:function(){
    // Menu.Option.GetPictureMy(global_page.callBack)  //临时删除
    
  },


  /**
   *  页面加载
   */
  onLoad: function (param) {    
    global_page = this
    //1 page初始化高宽
    global_page.setData({
      windowWidth:app.globalData.windowWidth,
      windowHeight:app.globalData.windowHeight,
    })
    
    //2 user loginlogin
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
            method:"POST",
            data:Api.json2Form({
              js_code:res.code,
              session:_session,
            }),
            header:{ "Content-Type": "application/x-www-form-urlencoded" },
            success: function(res)
            {
              if (res.data.status == "true") //登陆成功
              {
                wx.setStorageSync('session', res.data.session)
                //Todo 初始化页面、目录
                global_page.onInit()
              }
                
              else
                wx.showToast({
                  title: '登陆失败',
                  icon: 'loading',
                  duration: 1000
                })              
            },
            fail:function(res) { 
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

    var that = this;
    // // 300ms后，隐藏loading
    setTimeout(function() {
          that.setData({
            hidden: true
          })
    }, 300)
  },

  //Page：private  初始化页面的钩子
  onInit:function( ){
    //数据初始化 图片
    var that = this;
    var url = Api.imgQuery() 

    var session = wx.getStorageSync('session') 
    if (! session  ) //检查session,不存在，为false
      session = "false"

    //获取表情列表
     wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"POST",
        data: Api.json2Form({
          session: session,
          category_id: 'null',
        }),
        header: {  
          "Content-Type": "application/x-www-form-urlencoded"  
        },
        success: function(res) {
          var object = res.data

          //temp 删除默认目录

          wx.setStorageSync(
              "emoticon",
              object.img_list
          )
          Render.emoticon(global_page,object.img_list)
        }
      })
    console.log("storyge" );
    
    

     //数据初始化 目录
      url = Api.categoryQuery() 
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"POST",
        data: Api.json2Form({
          session: session,
        }),
        header: {  
          "Content-Type": "application/x-www-form-urlencoded"  
        },
        success: function(res) {
          var object = res.data

            var _c = []
            for (var i=0 ; i< object.category_list.length ; i++)
                _c.push(object.category_list[i])
            global_page.setData({category:_c})
          // }
          
          wx.setStorageSync(
              "category",
              object.category_list
          )
        }
      })
    
  },

   //导航：水印页面
  navigateToEditor: function(e) {
    var url = '../watermark/watermark?imgurl=' + global_page.data.selectEmoticon;
    wx.navigateTo({
      url: url
    })
  },

  //导航：gif拼接页面
  navigateToJoin: function(e) {
    var url = '../join/join?imgurl=' + global_page.data.selectEmoticon;
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
})





