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
    miniHidden:false,
    treeHidden:false,
    
    editorUrl:"", //预备编辑的图片
    menu_left: "0rpx",
    menu_top: "50rpx",

    joinStep:1,
    joinFirstImg:"../../images/gif_in_1.gif",
    joinSecondeImg:"../../images/gif_in_2.gif",

    resize_success:[
      {img:"../../images/gif_in_1.gif",text:"大图"},
      {img:"../../images/gif_in_2.gif",text:"小图"},
      {img:"../../images/gif_in_1.gif",text:"大图"},
      {img:"../../images/gif_in_2.gif",text:"小图"},
    ],

    categoryTitle:"全部",
    category:["类别1","类别2","类别3"],
    
  },
  
  //点击“目录”开关
  categoryBtn : function() {
    global_page.setData({
      treeHidden: !global_page.data.treeHidden
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
      miniHidden: !global_page.data.miniHidden
    })
  },
  //上传图片
  uploadImage:function() {
    Menu.Option.ChooseImage(global_page.uploadSuccess)
  },
  
  //选择视频
  uploadVideo : function() {
    Menu.Option.ChooseVideo(global_page.uploadSuccess)
  },
  //上传 图片/视频 成功，显示图片
  uploadSuccess:function(imgUrl) {
    console.log("uploadSuccess:" + imgUrl)
    global_page.emoticonUpdate(imgUrl)
    // Menu.Option.ChooseImage()
  },

  //status 1 ： 更新1张图片，
  //status 2 ： 更新一串图片，
  emoticonUpdate: function(img) {
    //1张图片
    if(img.constructor == String)
    {
        var _img = img
        var _emoticonList = this.data.latest
        _emoticonList.unshift
        ({
            member:
            {
              "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
              "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
              "avatar_normal":_img
            }
        });
        console.log(_img)
        this.setData({latest:_emoticonList})
        return
    }

    //一串图片
    if(img.constructor == Array)
    {
      var _imgList = img
      var _emoticonList = this.data.latest
      for (var i=0 ; i<_imgList.length ;i++)
      {
        _emoticonList.unshift
        ({
          member:
          {
            "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
            "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
            "avatar_normal":_imgList[i]
          }
        });
      }
      this.setData({latest:_emoticonList})
    }
    
  },

  emoticonDelete: function(imgUrl) {
      var _imgUrl = imgUrl
      var _emoticonList = this.data.latest
      for (var i=0 ; i<_emoticonList.length ;i++)
      {
        if (_emoticonList[i]["member"]["avatar_normal"] == _imgUrl)
        {
          _emoticonList.splice(i,1)
          break
        }
      }
      this.setData({latest:_emoticonList})
  },

   //点击表情，打开第一级menu
  emoticonFirstMenu: function(e) {

    //准备当前预备编辑的图片地址
    global_page.setData({
      editorUrl:e.currentTarget.dataset.imgurl
    })
 
    var _left = e.currentTarget.offsetLeft-7 + "px";
    var _top = e.currentTarget.offsetTop-7 + "px";
    var _isPreDisplay = true;
    if(global_page.data.menu_left == _left && global_page.data.menu_top == _top) //如果click在同一target，消失
      _isPreDisplay = !global_page.data.isPreDisplay
    console.log(_isPreDisplay)
    
    global_page.setData({
      isPreDisplay:_isPreDisplay,
      menu_left: e.currentTarget.offsetLeft-7 + "px",
      menu_top: e.currentTarget.offsetTop-7 + "px",
    })
  },


  menuShare:function(){
    Menu.Option.Share( global_page.data.editorUrl )
  },
 
  //菜单 gif拼接
  menuJoinAdd:function(){
    console.log()
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

  /**
   * Page:private 回调函数
   */
  callBack:function(imgUrl,isDelete){
    if(imgUrl) 
      global_page.emoticonUpdate(imgUrl)

    if(isDelete)
      global_page.emoticonDelete(global_page.data.editorUrl)
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

  // reset

  onShow: function() {
    console.log(app.globalData.editorSuccess)
    
    /**
     * 编辑->收藏，
     * 进入private，在emotion列表中显示
     *  */
    var _editorData = app.globalData['editorSuccess']
    if ( _editorData != null && _editorData != '' &&  _editorData != 'undefined')
    {
      console.log(_editorData )
      global_page.emoticonUpdate(_editorData)
      app.globalData.editorSuccess = ''
    }

    /**
     * 公共页面->收藏，由storage临时保存
     * 进入private，在emotion列表中显示，
     * 清除storage
     *  */
    var _list = wx.getStorageSync('pre_collect')
    console.log(_list)
    if ( _list )
    {
      global_page.emoticonUpdate(_list)
      wx.removeStorageSync('pre_collect') //上传收藏信息后，清空存储
    }
  },

  /**
   * 加载完毕，更新图片
   */
  onReady:function(){
    Menu.Option.GetPictureMy(global_page.init)
  },

  init:function(imgUrl){
    global_page.setData({latest:imgUrl})
  },

  onLoad: function (param) {

    //初始化显示view
    var _view = {
      miniHidden:false,
      treeHidden:false
    }
    View.Switch.Init(this,_view)
    // View.Switch.On("miniHidden","treeHidden")
    View.Switch.Work()


    global_page = this
    this.fetchExpress();

    console.log(param['editorSuccess'])
  },
  fetchExpress:function() {
    var that = this;
    that.setData({
      latest: [
        {member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img3.imgtn.bdimg.com/it/u=3903157596,3789827809&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=1414733317,542758485&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=2355442825,1034056032&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=961666295,1941975572&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=4286943230,2152721706&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img.itlun.cn/uploads/allimg/150708/1-150FQ40144.gif"}
        },{member:{
          "avatar_normal":"http://upload.86628677.com/gifa/20150915/6a0544.gif"}
        },{member:{
          "avatar_normal":"http://img0.pconline.com.cn/pconline/1403/16/4445916_2013041711400540071.gif"}
        },{member:{
          "avatar_normal":"http://img0.imgtn.bdimg.com/it/u=288514605,1240644921&fm=21&gp=0.jpg"}
        },

        {member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img3.imgtn.bdimg.com/it/u=3903157596,3789827809&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=1414733317,542758485&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=2355442825,1034056032&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=961666295,1941975572&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=4286943230,2152721706&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img.itlun.cn/uploads/allimg/150708/1-150FQ40144.gif"}
        },{member:{
          "avatar_normal":"http://upload.86628677.com/gifa/20150915/6a0544.gif"}
        },{member:{
          "avatar_normal":"http://img0.pconline.com.cn/pconline/1403/16/4445916_2013041711400540071.gif"}
        },{member:{
          "avatar_normal":"http://img0.imgtn.bdimg.com/it/u=288514605,1240644921&fm=21&gp=0.jpg"}
        },

        {member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img3.imgtn.bdimg.com/it/u=3903157596,3789827809&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=1414733317,542758485&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=2355442825,1034056032&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=961666295,1941975572&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=4286943230,2152721706&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img.itlun.cn/uploads/allimg/150708/1-150FQ40144.gif"}
        },{member:{
          "avatar_normal":"http://upload.86628677.com/gifa/20150915/6a0544.gif"}
        },{member:{
          "avatar_normal":"http://img0.pconline.com.cn/pconline/1403/16/4445916_2013041711400540071.gif"}
        },{member:{
          "avatar_normal":"http://img0.imgtn.bdimg.com/it/u=288514605,1240644921&fm=21&gp=0.jpg"}
        },

        {member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img3.imgtn.bdimg.com/it/u=3903157596,3789827809&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=1414733317,542758485&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=2355442825,1034056032&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=961666295,1941975572&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=4286943230,2152721706&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img.itlun.cn/uploads/allimg/150708/1-150FQ40144.gif"}
        },{member:{
          "avatar_normal":"http://upload.86628677.com/gifa/20150915/6a0544.gif"}
        },{member:{
          "avatar_normal":"http://img0.pconline.com.cn/pconline/1403/16/4445916_2013041711400540071.gif"}
        },{member:{
          "avatar_normal":"http://img0.imgtn.bdimg.com/it/u=288514605,1240644921&fm=21&gp=0.jpg"}
        },

        {member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img3.imgtn.bdimg.com/it/u=3903157596,3789827809&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=1414733317,542758485&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=2355442825,1034056032&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://img1.imgtn.bdimg.com/it/u=961666295,1941975572&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img4.imgtn.bdimg.com/it/u=4286943230,2152721706&fm=21&gp=0.jpg"}
        },{member:{
          "avatar_normal":"http://img.itlun.cn/uploads/allimg/150708/1-150FQ40144.gif"}
        },{member:{
          "avatar_normal":"http://upload.86628677.com/gifa/20150915/6a0544.gif"}
        },{member:{
          "avatar_normal":"http://img0.pconline.com.cn/pconline/1403/16/4445916_2013041711400540071.gif"}
        },{member:{
          "avatar_normal":"http://img0.imgtn.bdimg.com/it/u=288514605,1240644921&fm=21&gp=0.jpg"}
        },

      ],
    })

    // 300ms后，隐藏loading
    setTimeout(function() {
          that.setData({
            hidden: true
          })
    }, 300)
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

  navigateToCategory: function(e) {
    var url = '../category/category'
    wx.navigateTo({
      url: url
    })
  },
})
