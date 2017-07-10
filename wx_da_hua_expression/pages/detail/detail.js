
var GLOBAL_PAGE
var APP = getApp()
var API = require('../../utils/api.js');

var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {

    artId:1,
    art:[],  
    tao_bao:[],

  },
  
  //To 订单页面
  toOrder:function(){
      wx.navigateTo({
          url: '../order/order',
      })
  },




  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(options)
    var that = this
    GLOBAL_PAGE = this
    GLOBAL_PAGE.setData({
      artId:options.art_id
    })
    GLOBAL_PAGE.test(options)
  },

  test: function (options) {
      console.log(options)
      wx.request({
          url: API.ARTICALE() , 
          method:"GET",
          data: {
            "art_id":options.art_id
          },
          success: function(res) {
              console.log("collect success:",res.data)
              var object = res.data
              if (object.status == "true")
              {
                  // var art = GLOBAL_PAGE.data.art
                  // var new_art = art.concat( res.data.content_list );
                  // art.push({sn:"1",style:"text",msg:res.data.a})
                  console.log(res.data.tao_bao)
                  GLOBAL_PAGE.setData({
                      swiper:res.data.swiper,
                      title:res.data.title,
                      art: res.data.art,
                      tao_bao:res.data.tao_bao,
                  })

                  var article = "<p>我爱你 </p>"
                  WxParse.wxParse('article', 'html', article, GLOBAL_PAGE, 5);
              }
          },
          fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
          }
      })
  },




  onShareAppMessage: function () { 
      return {
        title: GLOBAL_PAGE.data.title,
        desc: GLOBAL_PAGE.data.art[0].msg + '...',
        path: '/pages/detail/detail?art_id='+GLOBAL_PAGE.data.artId,
        }
   },




  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

})