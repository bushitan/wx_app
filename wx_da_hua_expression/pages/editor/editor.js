// editor.js
var Api = require('../../utils/api.js');

var globle_page
Page({
  data: {
    title: '最热话题',
    hotest: [],
    hidden: false,
    express_ModalHidden:true,
    express_mix:null,
    background:"http://120.27.97.33:91/static/mix/img_word.jpg",
    png:"http://120.27.97.33:91/static/mix/c.png",
    gif:"http://img0.imgtn.bdimg.com/it/u=288514605,1240644921&fm=21&gp=0.jpg",
    word_mix:"这次是踩死的节奏",
    offsetLeft: "64rpx",
    offsetTop: "53rpx",

  },

  size_sliderchange: function(e) {

  },
  x_sliderchange: function(e) {
    // console.log(e.detail.value)
    offsetValue = e.detail.value + 128
    globle_page.setData({
      offsetLeft:offsetValue + "rpx",
    })
  },
  y_sliderchange: function(e) {
    offsetValue = e.detail.value 
    globle_page.setData({
      offsetTop:offsetValue + "rpx",
    })
  },

  //生成表情，打开模态框
  editorCreate: function(e) {

    _word = globle_page.data.word_mix
    _x = parseInt(globle_page.data.offsetLeft.replace("px,","")) *3 ;
    _y = parseInt(globle_page.data.offsetTop.replace("px,","")) * 3;
    
    wx.request({
      url: 'http://120.27.97.33:91/grid/api/wx/image_mix',
      // method:"POST",
      data: {
        bg_img: 'img_word.jpg' ,
        word: _word,
        size: 100,
        x: _x,
        y:_y
      },
      header: {
          // 'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        // that.data.bg_img = "http://192.168.200.100:8000/"+ res.data
        globle_page.setData({
          express_mix:"http://120.27.97.33:91/"+ res.data
        })

        // 显示模态框
        globle_page.setData({
          express_ModalHidden: false
        })
        console.log("http://120.27.97.33:91/"+ res.data)
      }
    })
  },
  //模态框，分享链接
  modalShare: function(e) {
    this.setData({
      express_ModalHidden: true
    })
  },
  //模态框，返回编辑
  modalReEditor: function(e) {
    this.setData({
      express_ModalHidden: true
    })
  },

  // 事件处理函数
  redictDetail: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
      
    wx.navigateTo({
      url: url
    })
  },


  touchstart:function(event){
  
  },
  touchmove:function(event){
    // console.log(event.currentTarget.id)
    console.log(globle_page.data.offsetLeft,globle_page.data.offsetTop)

    globle_page.setData({
    // isTrue : !this.data.isTrue,
    offsetLeft:event.touches[0].clientX + "rpx",
    offsetTop:event.touches[0].clientY + "rpx",
    })
    // console.log("m:"+event.touches[0].clientX)
    // console.log("m:"+event.touches[0].clientY)

    
  },
  touchend:function(event){

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
   onLoad: function (options) {
     
    console.log(options.imgurl)
    this.setData({
      hidden: false,
      background:options.imgurl //更改背景图
    })
    globle_page = this
    // this.fetchData();
    // this.fetchExpress()
  },
})