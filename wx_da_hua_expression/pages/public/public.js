// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var Render = require('../../utils/render.js');
var Key = require('../../utils/storage_key.js');


var APP = getApp()
var GLOBAL_PAGE
Page({
  data: {
    displayLoading: true,
    keyword:"我擦", //搜索关键字
    // emoticon: [],
    hotLabel:["金馆长","我想静静","意外","疼！"],  
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

  /** Page:public 基础事件
   * 1、wxml的catchtap全触发eventBase
   * 2、eventDisplay:执行view的显示/隐藏
   * 3、eventListen:根据data-actiondata-action，确定执行的事件
   */
  eventBase:function(e){
    GLOBAL_PAGE.eventListen(e)
    GLOBAL_PAGE.eventDisplay(e.currentTarget.dataset.action)
  },

  /**
   * 触发view的隐藏显示
   */
  eventDisplay:function(action){
    var _display = {
      "onMenu":function(){ View.Switch.On("displayMenu") },
      "btnSearch":function(){ View.Switch.Off("displayMenu") },
      "btnShortcut":function(){ View.Switch.Off("displayMenu") },
      // "btnShare":function(){ View.Switch.Off("displayMenu") },
      // "btnCollect":function(){ View.Switch.Off("displayMenu") },
      "all":function(){View.Switch.Off("displayMenu")}, //公共透明遮罩
    }
    if (_display.hasOwnProperty(action))
      _display[action]()
    View.Switch.Work() //触发效果
  },
  eventListen:function(e){

    var _eventDict = {
      "onMenu":GLOBAL_PAGE.onMenu,
      "btnSearch":GLOBAL_PAGE.searchBtn,
      "btnShortcut":GLOBAL_PAGE.searchShortcut,
      "btnShare":GLOBAL_PAGE.menuShare,
      "btnCollect": GLOBAL_PAGE.menuCollect,
    }
    if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
      _eventDict[e.currentTarget.dataset.action](e) 
  },


  /**
   * 根据keyword，搜索
   */
  searchBtn:function(){
    //Todo 搜索信息
    //  刷新 hotest  hotLabel  连个参数
    var _keyword = GLOBAL_PAGE.data.keyword

    
    var url = Api.imgQuery() 
    var session = wx.getStorageSync(Key.session) 
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
          GLOBAL_PAGE.renderEmoticon(object.img_list)
        }
      })
  },

  /**点击Shortcut按钮，触发search搜索，
   * 更新keyword
   */
  searchShortcut:function(e){
    
    GLOBAL_PAGE.setData({
      keyword:e.currentTarget.dataset.keyword
    })
    GLOBAL_PAGE.searchBtn();

  },

  /**点击表情，悬浮菜单
   */
  onMenu: function(e) {

    //准备当前预备编辑的图片地址
    GLOBAL_PAGE.setData({
      selectEmoticon:{id: e.currentTarget.dataset.id, img_url:e.currentTarget.dataset.img_url}
    })
     if (e.currentTarget.offsetTop < 200)
       GLOBAL_PAGE.setData({classMenu:"m-down"})
    else
       GLOBAL_PAGE.setData({classMenu:"m-up"})
  
  },

  //图片分享
  menuShare:function(){
    Menu.Option.Share( GLOBAL_PAGE.data.editorUrl )
  },

  /**
   * 菜单收藏按钮，可以收藏多张
   * 跳转到Page：private时，onShow方法一齐显示
   */
  menuCollect:function(){
    // var _list = wx.getStorageSync('pre_collect')
    // var _new_list = Menu.Option.Collect( GLOBAL_PAGE.data.editorUrl,_list )
    // wx.setStorageSync(
    //     "pre_collect",
    //     _new_list
    // )
    /**Todo request增加用户-图片 记录
     * 添加成功，更新本地storage(emoticon)
     */

  },

  onLoad: function () {
    GLOBAL_PAGE = this
    //1 page初始化高宽
    console.log("width:" , APP.globalData.windowWidth)
    console.log("height:" , APP.globalData.windowHeight - 48)
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 48,
    })

    //测试登陆
    GLOBAL_PAGE.initTest()


    var that = this;
    // 300ms后，隐藏loading
    setTimeout(function() {
        View.Switch.Off("displayLoading")
        View.Switch.Work()
    }, 300)
  },

 

  onHide:function(){
    View.Switch.OffAll()
    View.Switch.Work()
  },

  onShow: function() {
    var _view = {
      displayLoading:this.data.displayLoading,
      displayMenu:this.data.displayMenu,
    }
    View.Switch.Init(this,_view)
    View.Switch.Work()
  },

  onReady:function(){
  },

  initTest:function(){
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

    
    GLOBAL_PAGE.renderEmoticon(e)
  },
  
  renderEmoticon:function(emoticon){
    Render.emoticon(GLOBAL_PAGE,emoticon)
  },

})
