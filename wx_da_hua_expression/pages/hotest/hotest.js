// hotest.js
var Api = require('../../utils/api.js');

var global_page
Page({
  data: {
    title: '最热话题',
    hotest: [],
    hidden: false,
    menu_left: "0px",
    menu_top: "50px",
    isPreDisplay:false,
  },
  // 事件处理函数
  redictDetail: function(e) {
    var id = e.currentTarget.id,
      // url = '../detail/detail?id=' + id;
      url = '../detail/detail';

      
    wx.navigateTo({
      url: url
    })
  },
  redictEditor: function(e) {
    // var url = '../editor/editor';
    // console.log(url)
    // wx.navigateTo({
    //   url: url
    // })
    console.log(e)  
    console.log(e.currentTarget.offsetLeft)  
    console.log(e.currentTarget.offsetTop)  
    var _left = e.currentTarget.offsetLeft-7 + "px";
    var _top = e.currentTarget.offsetTop-12 + "px";
    var _isPreDisplay = true;
    if(global_page.data.menu_left == _left && global_page.data.menu_top == _top)
      _isPreDisplay = !global_page.data.isPreDisplay
    global_page.setData({
      isPreDisplay:_isPreDisplay,
      menu_left: e.currentTarget.offsetLeft-7 + "px",
      menu_top: e.currentTarget.offsetTop-12 + "px",
    })
     

  },
  fetchData: function() {
    var that = this;
    wx.request({
      url: Api.getHotestTopic({
        p: null
      }),
      success: function(res) {
        console.log(res);
        that.setData({
          hotest: res.data
        })
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },

  fetchExpress:function() {
    var that = this;
    that.setData({
      hotest: [
        {member:{
          "avatar_large":"//cdn.v2ex.co/avatar/a8d9/a243/144294_large.png?m=1457670171",
          "avatar_mini":"//cdn.v2ex.co/avatar/a8d9/a243/144294_mini.png?m=1457670171",
          "avatar_normal":"http://127.0.0.1:8000/static/mix/movie3.gif"}
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

  onLoad: function () {
    
    global_page = this
    this.setData({
      hidden: false
    })
    // this.fetchData();
    this.fetchExpress()
  }
})
