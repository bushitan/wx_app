//index.js
//获取应用实例

var GLOBAL_PAGE
var APP = getApp()
var app = getApp()
var API = require('../../utils/api.js');

Page({
  data: {

    hotLabel:["表情同款","意见反馈"],//顶部按钮
    keyword:"表情同款",

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

    hiddenIndex: false,
    hiddenUserBack: true,
  },

  switchLabel:function(e){
    var keyword = e.currentTarget.dataset.keyword
    var hotLabel = GLOBAL_PAGE.data.hotLabel
    switch(keyword){
        case hotLabel[0]: 
          GLOBAL_PAGE.setData({
            hiddenIndex:false,
            hiddenUserBack:true
          });break;
        case hotLabel[1]: 
          GLOBAL_PAGE.setData({
            hiddenIndex:true,
            hiddenUserBack:false
          });break;
    }
    GLOBAL_PAGE.setData({
      keyword:keyword
    })
  },


  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    GLOBAL_PAGE = this

    // GLOBAL_PAGE.test()
     GLOBAL_PAGE.setData({
          productNewList: [{art_id:"1",title:"监听页面加载听页面加载听页面加载听页",summary:"生命周期函数生命周期函数生命周期函数生命周期函数"},{art_id:"1",title:"监听页面加载听页面加载听页面加载听页",summary:"生命周期函数生命周期函数生命周期函数生命周期函数"}]
      })

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