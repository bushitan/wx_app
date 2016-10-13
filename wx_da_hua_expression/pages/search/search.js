// latest.js
var Api = require('../../utils/api.js');

var global_page
Page({
  data: {
    title: '最新话题',
    latest: [],
    hidden: false,
    miniHidden:true,
  },
  ShowMiniBar:function() {
    global_page.setData({
      miniHidden: !global_page.data.miniHidden
    })
  },
  onPullDownRefresh: function () {
    this.fetchData();
    console.log('onPullDownRefresh', new Date())
  },
  // 事件处理函数
  redictDetail: function(e) {
    // var id = e.currentTarget.id,
    //   url = '../detail/detail?id=' + id;
   
    var url = '../editor/editor';
    wx.navigateTo({
      url: url
    })
  },
  fetchData: function() {
    var that = this;
    that.setData({
      hidden: false
    })
    wx.request({
      url: Api.getLatestTopic({
        p: 1
      }),
      success: function(res) {
        console.log(res);
        that.setData({
          latest: res.data
        })
        setTimeout(function() {
          that.setData({
            hidden: true
          })
        }, 300)
      }
    })
  },
  onLoad: function () {
    // this.fetchData();
    global_page = this
    this.fetchExpress();
    
  },
  fetchExpress:function() {
    var that = this;

    // 300ms后，隐藏loading
    setTimeout(function() {
          that.setData({
            hidden: true
          })
    }, 300)
  },
})