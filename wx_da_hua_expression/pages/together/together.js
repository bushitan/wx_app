// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var GLOBAL_PAGE;
var PAINTER_STEP_LOAD = 0;
var PAINTER_STEP_FREE = 1;
var PAINTER_STEP_BUSY = 2;
var PAINTER_STEP_SHARE = 3;
Page({
  data:{
      userId:"",
      joinThemeID:null,

      joinStatus: PAINTER_STEP_LOAD , // 0 加载中 1 未参与 ， 2正在参与
      themeName:"一起画表情",
      stepId:null,
      imgUrl:"", //下载的图片

      selfThemeList:[],
  },

  //判断用户是否正在参与活动
  joinRequest:function(){
      console.log("together joinRequest")
      wx.request({
          url: API.PAINTER_JOIN_LATEST(), 
          method:"GET",
          data: {
            session: wx.getStorageSync(KEY.session),
          },
          success: function(res) {
              var object = res.data
              console.log("together joinRequest success" , object)
              if (object.status == "true")
              { 
                //设置用户名称，等级
                  GLOBAL_PAGE.setData({ 
                    userId:object.user_id
                  })
                  //未加入游戏
                  if (object.join_status == PAINTER_STEP_FREE){ 
                      GLOBAL_PAGE.setData({ joinStatus:PAINTER_STEP_FREE,})
                      
                  }
                  //正在加入游戏
                  else if (object.join_status == PAINTER_STEP_BUSY){ 
                      GLOBAL_PAGE.setData({
                          joinStatus:PAINTER_STEP_BUSY,
                          themeName:object.theme_name ,
                          stepId: object.step_id,
                          imgUrl:object.img_url, 
                      })
                  }
                  //需要分享
                  else{ 
                      GLOBAL_PAGE.setData({ 
                          joinStatus:PAINTER_STEP_SHARE,
                          themeName:object.theme_name ,
                          stepId: object.step_id,
                          imgUrl:object.img_url, 
                      })
                  }

                  //TOdo 设置可画按钮
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

  //参与过的活动
  selfThemeQuery:function(){
    console.log("together selfThemeQuery ")
      wx.request({
        url: API.PAINTER_THEME_QUERY(), 
        method:"GET",
        data: {
          session: wx.getStorageSync(KEY.session),
        },
        success: function(res) {
          var object = res.data
          console.log("together selfThemeQuery success" , object)
          if (object.status == "true")
          {
              console.log(object)

              GLOBAL_PAGE.setData({
                  selfThemeList:object.theme_list
              })
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

  onShareAppMessage: function () { 
      return {
          title: '一起画吉吧',
          desc: '邀你来添两笔吉祥如意',
          path: '/pages/together/together'
      }
  },
  onLoad:function(option){
    // 页面初始化 options为页面跳转所带来的参数
      GLOBAL_PAGE = this
    //   GLOBAL_PAGE.init()
        //必须要登陆以后再做的事情
      if(APP.globalData.isLogin == true)
          GLOBAL_PAGE.onInit(option)
      else
          APP.login(option)

  },

    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
       //Todo 登陆过后做的请求
       GLOBAL_PAGE.init()   //更新状态
    },

  onShow:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log("together onShow")
    if(APP.globalData.isLogin == true) //用户登陆以后，onshow页面自动刷新
      GLOBAL_PAGE.init()
      
  },
  //页面初始化
  init:function(){ 
      var _current_step = wx.getStorageSync(KEY.PAINTER_STEP_CURRENT_INFO)
      // if ( _current_step =="" ){ //第一次登陆，没有信息
      GLOBAL_PAGE.setData({
          joinStatus:PAINTER_STEP_LOAD,
      })
      GLOBAL_PAGE.joinRequest()
      GLOBAL_PAGE.selfThemeQuery()
      return
  },
  onReady:function(){
    // 页面渲染完成
  },
  // onShow:function(){
  //   // 页面显示
  // },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

    //导航：画布页面
  startToPainter: function(e) {
    var url = '../painter/painter'
    wx.navigateTo({
      url: url
    })
  },
  continueToPainter: function(e) {

    var url = '../painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_BUSY
    // var url = '../painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_SHARE
    wx.navigateTo({
      url: url
    })
  },  

  shareToPainter: function(e) {

    var url = '../painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_SHARE
    wx.navigateTo({
      url: url
    })
  },  

     //导航：播放器 
  navigateToPlayer: function(e) {
    var theme_id = e.currentTarget.dataset.theme_id
    var url = '../player/player?theme_id=' + theme_id
    wx.navigateTo({
      url: url
    })
  },

})