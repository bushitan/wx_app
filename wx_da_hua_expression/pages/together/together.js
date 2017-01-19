// pages/together/together.js
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');

var GLOBAL_PAGE;
var PAINTER_STEP_LOAD = 0;
var PAINTER_STEP_FREE = 1;
var PAINTER_STEP_BUSY = 2;
Page({
  data:{
      
      joinThemeID:null,

      userStatus: 0 , // 0 加载中 1 未参与 ， 2正在参与
      themeName:"一起画表情",
      stepId:null,
      imgUrl:"", //下载的图片
  },

  //判断用户是否正在参与活动
  joinRequest:function(){
      wx.request({
        url: API.PAINTER_JOIN_LATEST(), 
        method:"GET",
        data: {
          session: wx.getStorageSync(KEY.session),
        },
        success: function(res) {
          var object = res.data
          if (object.status == "true")
          {
              //正在加入游戏
              if (object.is_join == "true"){ 
                  GLOBAL_PAGE.setData({
                    userStatus:PAINTER_STEP_BUSY,
                    themeName:object.theme_name ,
                    stepId: object.step_id,
                    imgUrl:object.img_url, 
                  })
                  wx.setStorageSync(
                      KEY.PAINTER_STEP_CURRENT_INFO,
                      {
                          status:PAINTER_STEP_BUSY,
                          theme_name:object.theme_name ,
                          step_id: object.step_id,
                          img_url:object.img_url,
                      }
                  )
              }
              //未加入游戏
              else{ 
                  GLOBAL_PAGE.setData({ userStatus:PAINTER_STEP_FREE,})
                  wx.setStorageSync(KEY.PAINTER_STEP_CURRENT_INFO,{
                      status:PAINTER_STEP_FREE
                  }) //未加入
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

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
      GLOBAL_PAGE = this
      GLOBAL_PAGE.init()

  },

  //页面初始化
  init:function(){ 
      var _current_step = wx.getStorageSync(KEY.PAINTER_STEP_CURRENT_INFO)
      // if ( _current_step =="" ){ //第一次登陆，没有信息
      GLOBAL_PAGE.setData({
          userStatus:PAINTER_STEP_LOAD,
      })
      GLOBAL_PAGE.joinRequest()
      return
      // }
      // else if ( _current_step.status == PAINTER_STEP_FREE){ //空闲状态
      //     GLOBAL_PAGE.setData({
      //         userStatus:PAINTER_STEP_FREE,
      //     })
      // }
      // else {  //正在画
      //     GLOBAL_PAGE.setData({
      //         userStatus:PAINTER_STEP_BUSY,
      //         themeName:_current_step.theme_name ,
      //         stepId: _current_step.step_id,
      //         imgUrl:_current_step.img_url, 
      //     })
      // }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

    //导航：画布页面
  navigateToPainter: function(e) {
    var url = '../painter/painter'
    wx.navigateTo({
      url: url
    })
  }, 
     //导航：播放器 
  navigateToPlayer: function(e) {
    var url = '../player/player'
    wx.navigateTo({
      url: url
    })
  },

})



// joinRequest:function(){
//       wx.request({
//         url: API.PAINTER_JOIN_LATEST(), 
//         method:"GET",
//         data: {
//           session: wx.getStorageSync(KEY.session),
//         },
//         success: function(res) {
//           var object = res.data
//           if (object.status == "true")
//           {
//               //正在加入游戏
//               if (object.is_join == "true"){
//                   GLOBAL_PAGE.setData({
//                     userStatus:1,
//                     joinThemeID:object.theme_id, //正在参加的主题id
//                   })
//                   wx.setStorageSync(
//                       KEY.PAINTER_USER_STATUS,
//                       {
//                         userStatus:1,
//                         joinThemeID:object.theme_id, 
//                       }
//                   )
//               }
//               else{ //未加入游戏
//                   GLOBAL_PAGE.setData({
//                     userStatus:0, 
//                   })
//                   wx.setStorageSync(
//                       KEY.PAINTER_USER_STATUS,
//                       {
//                         userStatus:0,
//                         joinThemeID:null, 
//                       }
//                   )
//               }

//               //TOdo 设置可画按钮
//           }
//           else
//           wx.showModal({
//               title: '网络连接失败，请重试',
//               showCancel:false,
//           })
//         },
//         fail:function(res){
//             wx.showModal({
//                 title: '网络连接失败，请重试',
//                 showCancel:false,
//             })
//         },

//       })
//   },