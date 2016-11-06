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

    

    //控制菜单上架
    classMenu:"m-down",  //m-up  m-down

    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,
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
      "onMenu":global_page.onMenu,
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
  onMenu: function(e) {

    //准备当前预备编辑的图片地址
    global_page.setData({
      editorUrl:e.currentTarget.dataset.imgurl
    })
     if (e.currentTarget.offsetTop < 200)
       global_page.setData({classMenu:"m-down"})
    else
       global_page.setData({classMenu:"m-up"})
  
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

    global_page = this

    //获取手机信息
    var _pixelRatio,_windowWidth,_windowHeight
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)

        _pixelRatio = res.pixelRatio
        _windowWidth = res.windowWidth
        _windowHeight = res.windowHeight
      }
    })
    this.setData({
      windowWidth:_windowWidth,
      windowHeight:_windowHeight
    })
    
    //数据初始化
    var that = this;
    var url = Api.imgQuery() 
    let formData = new FormData();

    formData.append("uid","9");
    formData.append("category_id","null");
    fetch(url , {
        method: 'POST',
        headers: {},
        body: formData,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    }).then((object) => {
        console.log(object);
  
        var _hotest = []
        var _list = object.img_list
        for (var i=0;i<_list.length;i++)  
          _hotest.push(_list[i]["yun_url"])
        global_page.setData({hotest:_hotest})
    }).catch((error) => {
        console.error(error);
    });
    // Menu.Option.GetPictureHot("2321",global_page.callBack)
  
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

    
  }
})
