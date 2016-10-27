// latest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');

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
    
  },
  
  //点击“目录”开关
  switchTree : function() {
    global_page.setData({
      treeHidden: !global_page.data.treeHidden
    })
  },
  //点击“+”开关
  switchMiniBar:function() {
    global_page.setData({
      miniHidden: !global_page.data.miniHidden
    })
  },
   //点击表情，打开第一级menu
  switchFirstMenu: function(e) {

    //准备当前预备编辑的图片地址
    global_page.setData({
      editorUrl:e.currentTarget.dataset.imgurl
    })

    console.log(e)  
    console.log(e.currentTarget.offsetLeft)  
    console.log(e.currentTarget.offsetTop)  
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
  //选择图片
  chooseImage:function() {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        global_page.setData({
          new_image: tempFilePaths
        })
      }
    })
  },
  //选择视频
  chooseVideo : function() {
      wx.chooseVideo({
          sourceType: ['album','camera'],
          maxDuration: 60,
          camera: ['front','back'],
          success: function(res) {
              global_page.setData({
                  new_video: res.tempFilePaths[0]
              })
          }
      })
  },

 

 


  // onShow:function()
  // {
  //   var appInstance = getApp()
  //   console.log(appInstance.globalData)
  //   appInstance.test_fetch(global_page)
  // },
  // testCallBack:function(){
  //   console.log(global_page.data.latest)
  //   global_page.setData({latest:[]})
  //   console.log(global_page.data.latest)
  // },

  onShow: function() {
    console.log(app.globalData.editorSuccess)
    
    var _editorData = app.globalData['editorSuccess']
    if ( _editorData != null && _editorData != '' &&  _editorData != 'undefined')
    {
      console.log(_editorData )
      var _tempList = this.data.latest
      _tempList.unshift(
        {
          member:{
            "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
            "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
            "avatar_normal":_editorData
          }
        }
      );
      console.log(_editorData)
      this.setData({latest:_tempList})
      app.globalData.editorSuccess = ''
    }
    
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

    console.log(param['editorSucess'])
    

    
    
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
})


//load加载——结束
  // fetchData: function() {
  //   var that = this;
  //   that.setData({
  //     hidden: false
  //   })
  //   wx.request({
  //     url: Api.getLatestTopic({
  //       p: 1
  //     }),
  //     success: function(res) {
  //       console.log(res);
  //       that.setData({
  //         "latest": res.data
  //       })
  //       setTimeout(function() {
  //         that.setData({
  //           hidden: true
  //         })
  //       }, 300)
  //     }
  //   })
  // },