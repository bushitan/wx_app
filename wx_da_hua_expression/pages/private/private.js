// latest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var app = getApp()
var global_page
var appInstance
Page({
  data: {
    title: '最新话题',
    latest: [],
    hidden: false,
    
    displayUpload:false,
    displayCategory:false,
    displayMenu:false,
    displayMask:false,
    displayJoin:false,
    displayResize:false,
    editorUrl:"", //预备编辑的图片
    menu_left: "0rpx",
    menu_top: "50rpx",

    joinStep:1,
    joinFirstImg:"../../images/gif_in_1.gif",
    joinSecondeImg:"../../images/gif_in_2.gif",

    resize_success:[
      {img:"../../images/gif_in_1.gif",text:"170x170"},
      {img:"../../images/gif_in_2.gif",text:"128x128"},
      {img:"../../images/gif_in_1.gif",text:"96x96"},
      {img:"../../images/gif_in_2.gif",text:"48x48"},
    ],

    categoryTitle:"全部",
    category:["类别1","类别2","类别3"],
    
  },

  /** No.1
   * Page:private 回调函数
   * 该页面唯一的回调函数
   * imgUrl:按时间先手顺序加入， 逆转时间显示
   * isDelete:确认删除图片
   */
  callBack:function(imgUrl,isDelete){
    if(imgUrl) 
      global_page.emoticonUpdate(imgUrl)

    if(isDelete)
      global_page.emoticonDelete(global_page.data.editorUrl)
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
      //目录菜单
      "btnCategory":function(){View.Switch.OffAllExcept("displayCategory","displayMask")}, //btn目录，显示目录、遮罩
      "changeCategory":function(){View.Switch.Off("displayCategory","displayMask")},//选择目录，关闭目录、遮罩
      "navigateToCategory":function(){View.Switch.Off("displayCategory","displayMask")},//设置目录，关闭目录、遮罩
      //上传菜单
      "btnUpload":function(){ View.Switch.OffAllExcept("displayUpload","displayMask") },//btn上传，显示上传、遮罩
      "navigateToPainter":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传图片，关闭上传、遮罩
      "uploadImage":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传图片，关闭上传、遮罩
      "uploadVideo":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传视频，关闭上传、遮罩
      // 表情功能菜单
      "onMenu":function(){ View.Switch.On("displayMenu") },//btn打开菜单
      "menuJoinAdd":function(){ View.Switch.OffAllExcept("displayJoin") },
      // "menuJoinOK":function(){ View.Switch.Off("displayMenu") },
      "menuResize":function(){ View.Switch.OffAllExcept("displayResize")},
      // "menuResizeShare":function(){ View.Switch.Off("displayMenu") },
      // "menuResizeAdd":function(){ View.Switch.Off("displayMenu") },
      // "menuShare":function(){ View.Switch.Off("displayMenu") },
      "navigateToEditor":function(){ View.Switch.Off("displayMenu") },
      "menuDelete":function(){ View.Switch.OffAll() },
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
      "btnCategory":global_page.categoryBtn,
      "changeCategory":global_page.categoryChange,
      "navigateToCategory":global_page.navigateToCategory,

      "btnUpload":global_page.uploadBtn,
      "navigateToPainter": global_page.navigateToPainter,
      "uploadImage": global_page.uploadImage,
      "uploadVideo": global_page.uploadVideo,

      "menuJoinOK": global_page.menuJoinOK,
      "menuResizeShare": global_page.menuResizeShare,
      "menuResizeAdd": global_page.menuResizeAdd,
      "onMenu": global_page.onMenu,
      "menuShare": global_page.menuShare,
      "navigateToEditor": global_page.navigateToEditor,
      "menuJoinAdd": global_page.menuJoinAdd,
      "menuDelete": global_page.menuDelete,
      "menuMoveCategory": global_page.menuMoveCategory,
      "menuResize": global_page.menuResize,
    }

    if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
      _eventDict[e.currentTarget.dataset.action](e) 
  },




  //点击“目录”开关
  categoryBtn : function() {
    global_page.setData({
      displayCategory: !global_page.data.displayCategory
    })
  },

  categoryChange :function(e){
    global_page.setData({
      categoryTitle:e.currentTarget.dataset.category
    })
  },
  //点击“+”开关
  uploadBtn:function() {
    global_page.setData({
      displayUpload: !global_page.data.displayUpload
    })
  },
  //上传图片
  uploadImage:function() {
    Menu.Option.ChooseImage(global_page.callBack)
  },
  
  //选择视频
  uploadVideo : function() {
    Menu.Option.ChooseVideo(global_page.callBack)
  },

  /** 页面更新表情
   * status 1 ： 更新1张图片，
   * status 2 ： 更新一串图片，
   */
  emoticonUpdate: function(img) {
    //1张图片
    if(img.constructor == String)
    {
        var _img = img
        var _emoticonList = this.data.latest
        _emoticonList.unshift(_img)
        this.setData({latest:_emoticonList})
        return
    }
    //一串图片
    if(img.constructor == Array)
    {
      var _imgList = img
      var _emoticonList = this.data.latest
      for (var i=0 ; i<_imgList.length ;i++) //按时间插入图片
        _emoticonList.unshift(_imgList[i])
      this.setData({latest:_emoticonList})
    }
    
  },
  
  /** 页面删除表情
   * Todo deletePicture 删除表情
   */
  emoticonDelete: function(imgUrl) {
      var _imgUrl = imgUrl
      var _emoticonList = this.data.latest
      for (var i=0 ; i<_emoticonList.length ;i++)
      {
        if (_emoticonList[i] == _imgUrl)
        {
          _emoticonList.splice(i,1)
          break
        }
      }
      this.setData({latest:_emoticonList})
  },

   //点击表情，打开第一级menu
  onMenu: function(e) {
    //准备当前预备编辑的图片地址
    global_page.setData({
      editorUrl:e.currentTarget.dataset.imgurl
    })
    //menu显示位置修正
    var _left = e.currentTarget.offsetLeft-7 + "px";
    var _top = e.currentTarget.offsetTop-7 + "px";
 
    //设置menu可见，X/Y
    global_page.setData({
      menu_left: e.currentTarget.offsetLeft-7 + "px",
      menu_top: e.currentTarget.offsetTop-7 + "px",
    })
  },


  menuShare:function(){
    Menu.Option.Share( global_page.data.editorUrl )
  },
 
  //菜单 gif拼接
  menuJoinAdd:function(){
    //增加第一幅
    if(global_page.data.joinStep == 1)
    {
      global_page.setData({ 
         joinFirstImg:global_page.data.editorUrl,
         joinStep:2
      }) 
      return
    }
    //增加第二幅
    if(global_page.data.joinStep == 2)
    {
      global_page.setData({ 
         joinSecondeImg:global_page.data.editorUrl,
        joinStep:1 
      }) 
      return
    }
  },

  //拼接确认
  menuJoinOK:function(){
    var _imgFirst = global_page.data.joinFirstImg
    var _imgSeconde = global_page.data.joinSecondeImg
    //两张图片相同，不做拼接
    if ( global_page.data.joinFirstImg == global_page.data.joinSecondeImg )
    {
      wx.showToast({
        title: '不能拼接相同的表情',
        icon: 'loading',
        duration: 2000
      })
      return
    }
    
    Menu.Option.EditorJoin(_imgFirst,_imgSeconde,global_page.callBack)
  },

  //裁剪
  menuResize:function(){
    var _tempList = this.data.resize_success
    if (_tempList.length == 4) //大于4张，从第一格顶替
      _tempList.pop()
    _tempList.unshift(
       {img:global_page.data.editorUrl , text:"大图"},
    )
    this.setData({resize_success:_tempList})
  },

  //裁剪后，选择分享
  menuResizeShare:function(e){
    var _img_url = e.currentTarget.dataset.imgurl
    Menu.Option.Share(_img_url)
  },

  //裁剪后，选择增加
  menuResizeAdd:function(e){
    var img = e.currentTarget.dataset.imgurl
    global_page.emoticonUpdate(img)
  },

  //表情删除
  menuDelete:function(){
    Menu.Option.Delete(global_page.callBack)
    //删除后，menu框隐藏
  },

  menuMoveCategory:function(){
    wx.showActionSheet({
      itemList: global_page.data.category,
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    })
  },

  onHide:function(){
    View.Switch.OffAll()
    View.Switch.Work()
  },

  onShow: function() {
    var _view = {
      displayUpload:false,
      displayCategory:false,
      displayMenu:false,
      displayMask:false,
      displayJoin:false,
      displayResize:false,
    }
    View.Switch.Init(this,_view)
    View.Switch.Work()
    /**
     * 编辑->收藏，
     * 进入private，在emotion列表中显示
     *  */
    var _editorData = wx.getStorageSync('pre_editor')
    if ( _editorData )
    {
      //Todo  addPicture 增加表情
      global_page.emoticonUpdate(_editorData)
      wx.removeStorageSync('pre_editor') 

    }

    /**
     * 公共页面->收藏，由storage临时保存
     * 进入private，在emotion列表中显示，
     * 清除storage
     *  */
    var _list = wx.getStorageSync('pre_collect')
    if ( _list )
    {
      global_page.emoticonUpdate(_list)
      //Todo  addPicture 增加表情
      wx.removeStorageSync('pre_collect') //上传收藏信息后，清空存储
    }
  },

  /**
   * 加载完毕，更新图片
   */
  onReady:function(){
    // Menu.Option.GetPictureMy(global_page.callBack)  临时删除

    this.setData({
      latest:[
        "../../images/gif_anim.gif",
        "../../images/gif_anim1.gif",
        "../../images/gif_anim.gif",
        "../../images/gif_anim1.gif",
        "../../images/gif_anim1.gif",
        "../../images/gif_anim1.gif",
      ]
    })
    var that = this;
    // 300ms后，隐藏loading
    setTimeout(function() {
          that.setData({
            hidden: true
          })
    }, 300)
  },


  /**
   *  页面加载
   */
  onLoad: function (param) {
    //初始化显示view
    
    global_page = this
  },


   //导航：水印页面
  navigateToEditor: function(e) {
    var url = '../watermark/watermark?imgurl=' + global_page.data.editorUrl;
    wx.navigateTo({
      url: url
    })
  },

  //导航：gif拼接页面
  navigateToJoin: function(e) {
    var url = '../join/join?imgurl=' + global_page.data.editorUrl;
    wx.navigateTo({
      url: url
    })
  },
  
  //导航：目录设置页面
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
