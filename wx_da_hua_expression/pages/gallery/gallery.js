// private.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');
var Render = require('../../utils/render.js');
var KEY = require('../../utils/storage_key.js');

var APP = getApp()
var GLOBAL_PAGE
var appInstance
var i = 0
Page({
  data: {
    pageName: "private",
    //loading框
    loadShow: true,

    // category scroll-view的宽度
    categoryScrollWidth : 10,
    
    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,

    //页面渲染数据
    emoticon:[],
    category:[],

    //touch选择对象
    selectEmoticon:{id:"",name:"",img_url:"",size:""}, //预备编辑的图片
    selectCategory:{category_id:null,name:""},
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


  /**渲染表情 */
  renderEmoticon:function(){
    //根据条件选择emoticon，重新渲染
    var c_id = GLOBAL_PAGE.data.selectCategory.category_id 
    var e_storage = wx.getStorageSync(KEY.emoticon) //存储
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

  // 分享页面
  onShareAppMessage: function () { 
      return {
        title: '表情袋',
        desc: '海量表情天天让你惊喜，斗图乐趣无限，ヽ(°◇° )ノ',
        path: '/pages/private/private'
      }
  },

  /**
   *  页面加载
   */
  onLoad: function (option) {   

    GLOBAL_PAGE = this
    //1 page初始化高宽
  
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 42,  //category框高度42px
      categoryScrollWidth:APP.globalData.windowWidth - 60,

    })

    console.log("session:", wx.getStorageSync('session') )

    //必须要登陆以后再做的事情
    if(APP.globalData.isLogin == true)
        GLOBAL_PAGE.onInit(option)
    else
        APP.login(option)
  
    // // 300ms后，隐藏loading
    setTimeout(function() {
          GLOBAL_PAGE.setData({
            loadShow: false
          })
    }, 500)
  },

    //必须要登陆以后发起的请求，在这里完成
  onInit:function(option){
      //Todo 登陆过后做的请求
      if(wx.getStorageSync(KEY.emoticon)=="" || wx.getStorageSync(KEY.emoticon)==""  ){
          //加载图片
          GLOBAL_PAGE.init()
      }else{
          //直接
          GLOBAL_PAGE.renderEmoticon()
          GLOBAL_PAGE.renderCategory()
      }
    
  },


  //Page：private  初始化页面的钩子
  init:function( ){
    //数据初始化 图片
    var that = this;
    var url = Api.imgQuery() 

    var session = wx.getStorageSync(KEY.session) 
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
          if (object.status == "true")
          {
              wx.setStorageSync(
                  KEY.emoticon,
                  object.img_list
              )
              GLOBAL_PAGE.renderEmoticon()
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
          if (object.status == "true")
          { 
              //设置selecCategory == 默认目录。
              wx.setStorageSync(
                  KEY.category,
                  object.category_list
              )
              GLOBAL_PAGE.renderCategory()
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
      })
  },

   //导航：水印页面
  navigateBack: function(e) {
      var cache_image = {
          img_url:e.currentTarget.dataset.yun_url,
          width:e.currentTarget.dataset.width,
          height:e.currentTarget.dataset.height,
      }

      wx.setStorageSync(KEY.PAINTER_IMAGE_SELECT, cache_image)
      wx.navigateBack()
  },

  //导航：gif拼接页面
  navigateToPublic: function(e) {
    var url = '../public/public'
    wx.switchTab({
      url: url
    })
  },

})




