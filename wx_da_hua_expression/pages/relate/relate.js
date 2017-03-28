//index.js
//获取应用实例

var GLOBAL_PAGE
var APP = getApp()
var app = getApp()
var API = require('../../utils/api.js');

Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    classesPic: [],
    shelf: {
      english_name: "New Arrivals",
      name: "新品上架"
    },
    productNewList: [],
    bindtapName: "index",
    hiddenNew: true,
    hiddenHot: true,
    hiddenIndex: false
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    GLOBAL_PAGE = this
    GLOBAL_PAGE.test()
  },

  test: function (options) {
      wx.request({
          url: API.ARTICALE_LIST() , 
          method:"GET",
          data: {
            // session: wx.getStorageSync(KEY.session),
            // img_id: select_id,
          },
          success: function(res) {
              console.log("collect success:",res.data)
              var object = res.data
              if (object.status == "true")
              {
                  GLOBAL_PAGE.setData({
                     productNewList: res.data.art_list
                  })
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
        title: '灵魂画师开车了',
        desc: '惊呆了，表情离开了微信居然是这样',
        path: '/pages/relate/relate',
        // path: '/pages/public/public?keyword='+GLOBAL_PAGE.data.keyword
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

  toNew: function (res) {
    this.setData({
      hiddenNew: false,
      hiddenHot: true,
      hiddenIndex: true
    })
  },
  toHot: function (res) {
    this.setData({
      hiddenNew: true,
      hiddenHot: false,
      hiddenIndex: true
    })
  },
  toIndex: function () {
    this.setData({
      hiddenNew: true,
      hiddenHot: true,
      hiddenIndex: false
    })
  }
})