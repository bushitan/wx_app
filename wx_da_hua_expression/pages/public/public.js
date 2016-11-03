// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var global_page
Page({
  data: {
    title: '最热话题',
    displayLoading: true,
    menu_left: "0rpx",
    menu_top: "50rpx",
    displayMenu:false,

    keyword:"我擦", //搜索关键字

    editorUrl:"",
    
    hotest: [],
    hotLabel:["金馆长","我想静静","意外","疼！"],

  },

  //Page:public 的函数
  callBack:function(imgUrl){
    global_page.setData({hotest:imgUrl})
  },

  /** Page:public 基础事件
   * 1、wxml的catchtap全触发eventBase
   * 2、eventDisplay:执行view的显示/隐藏
   * 3、eventListen:根据data-actiondata-action，确定执行的事件
   */
  eventBase:function(e){
    global_page.eventListen(e)
    global_page.eventDisplay(e.currentTarget.dataset.action)
  },

  /**
   * 触发view的隐藏显示
   */
  eventDisplay:function(action){
    var _display = {
      "onMenu":function(){ View.Switch.On("displayMenu") },
      "btnSearch":function(){ View.Switch.Off("displayMenu") },
      "btnShortcut":function(){ View.Switch.Off("displayMenu") },
      "btnShare":function(){ View.Switch.Off("displayMenu") },
      "btnCollect":function(){ View.Switch.Off("displayMenu") },
      "all":function(){View.Switch.Off("displayMenu")}, //公共透明遮罩
    }
    if (_display.hasOwnProperty(action))
      _display[action]()
    View.Switch.Work() //触发效果
  },
  eventListen:function(e){

    var _eventDict = {
      "onMenu":global_page.switchFirstMenu,
      "btnSearch":global_page.searchBtn,
      "btnShortcut":global_page.searchShortcut,
      "btnShare":global_page.menuShare,
      "btnCollect": global_page.menuCollect,
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
    var _keyword = global_page.data.keyword
    Menu.Option.GetPictureHot(_keyword,global_page.callBack)

  },

  /**点击Shortcut按钮，触发search搜索，
   * 更新keyword
   */
  searchShortcut:function(e){
    
    global_page.setData({
      keyword:e.currentTarget.dataset.keyword
    })
    global_page.searchBtn();

  },

  /**点击表情，悬浮菜单
   */
  switchFirstMenu: function(e) {

    //准备当前预备编辑的图片地址
    global_page.setData({
      editorUrl:e.currentTarget.dataset.imgurl
    })
    
    console.log(e.currentTarget.dataset.imgurl)
    console.log(global_page.data.editorUrl)
    var _left = e.currentTarget.offsetLeft-7 + "px";
    var _top = e.currentTarget.offsetTop-7 + "px";
    var _isPreDisplay = true;
    if(global_page.data.menu_left == _left && global_page.data.menu_top == _top) //如果click在同一target，消失
      _isPreDisplay = !global_page.data.isPreDisplay
      
    global_page.setData({
      isPreDisplay:_isPreDisplay,
      menu_left: e.currentTarget.offsetLeft-7 + "px",
      menu_top: e.currentTarget.offsetTop-7 + "px",
    })
  },

  //图片分享
  menuShare:function(){
    Menu.Option.Share( global_page.data.editorUrl )
  },

  /**
   * 菜单收藏按钮，可以收藏多张
   * 跳转到Page：private时，onShow方法一齐显示
   */
  menuCollect:function(){
    var _list = wx.getStorageSync('pre_collect')
    var _new_list = Menu.Option.Collect( global_page.data.editorUrl,_list )
    wx.setStorageSync(
        "pre_collect",
        _new_list
    )
  },

  onLoad: function () {

    /**this.data 中的的 display先手动同步
     */
    // var _view = {
    //   displayLoading:this.data.displayLoading,
    //   displayMenu:this.data.displayMenu,
    // }
    // View.Switch.Init(this,_view)
    // // View.Switch.Off("hidden","isPreDisplay")
    // View.Switch.Work()

    // console.log(this.data.isPreDisplay)
    global_page = this
    // this.setData({
    //   hidden: false
    // })
    
  
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
    // Menu.Option.GetPictureHot("2321",global_page.callBack)
    this.setData({
      hotest:[
      
        "../../images/gif_anim.gif",
        "../../images/gif_anim1.gif",
        "../../images/gif_anim1.gif",
        "../../images/gif_anim1.gif",
      ]
    })


    var that = this;
    // 300ms后，隐藏loading
    setTimeout(function() {
        View.Switch.Off("displayLoading")
        View.Switch.Work()
    }, 300)
  }
})
