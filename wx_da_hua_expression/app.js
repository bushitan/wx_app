//app.js
var g
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

 
    g = this
  },
  test_fetch:function (page){
    var _page = page
    console.log("test_fetch")
    var url = "http://127.0.0.1:8000/emoticon/resize/"
    fetch(url).then(function(response){
      g.globalData.url = 11
      // alert(11)
      console.log(response)
      _page.testCallBack()
      console.log("page:"+_page)
     
    })
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
  globalData:{
    userInfo:null,
    aa:"aa",
    url:"uuuuuuu",
  }
})

// , {
//       "pagePath": "pages/editor/editor",
//       "text": "创作",
//       "iconPath":"images/node.png",
//       "selectedIconPath":"images/node_on.png"
//     }, {
//       "pagePath": "pages/manage/manage",
//       "text": "审核",
//       "iconPath":"images/board.png",
//       "selectedIconPath":"images/board_on.png"
//     }