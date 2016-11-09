//app.js
var Api = require('utils/api.js');
var g
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // this.getUserInfo()
 
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
    // if(this.globalData.userInfo){
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // }else{
      //调用登录接口


    wx.login({
      success: function () {
        
      }
    });

    console.log("getUserInfo")
    wx.getUserInfo({
        success: function (res) {
          that.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(that.globalData.userInfo)
          // Todo 根据微信登陆认证，获取open-idopen-id
          //假设已经获取到了open_id
          
          console.log(Api.json2Form({
              name: '管理员' ,
              wx_code: '',
              wx_open_id: that.globalData.open_id,
              is_public: 0,
              uuid: '',
            }))
          var url = Api.userAdd() //用户认证接口，没有用户添加，有用户做已登录
          wx.request({
            url: url, //仅为示例，并非真实的接口地址
            method:"POST",
            data: Api.json2Form({
              name: '管理员' ,
              wx_code: '',
              wx_open_id: that.globalData.open_id,
              is_public: 0,
              uuid: '',
            }),
            header: {  
              "Content-Type": "application/x-www-form-urlencoded"  
            },
            success: function(res) { //登陆后，用户设置用户id
            console.log("success")
              that.globalData.uid = res.data.uid; 
              that.globalData.pagePrivate.onInit()
              console.log(JSON.stringify("id"+res.data.uid));
            },
            fail:function(res) { 
              console.log("fail")
              console.log(res)
            },
            complete:function(res) { 
              console.log("complete")
              console.log(res)
            },
          })
        }
      })

    // }
  },
  userLoad:function(){},

  setPage:function(name,page){
    // console.log("in app.js setPage")
    // console.log(name + page)
    if (name == "private")
      this.globalData.pagePrivate = page
    if (name == "public")
      this.globalData.pagePublic = page
  },
  globalData:{
    open_id:"hfjsk-wru324l_4359",   //第一个用户
    // open_id:"0123456789_!@#$%^&*()_+:",  //管理员
    uid:"",
    userInfo:null,
    aa:"aa",
    url:"uuuuuuu",
    editorSuccess:"",

    pagePrivate:null,
    pagePublic:null,
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