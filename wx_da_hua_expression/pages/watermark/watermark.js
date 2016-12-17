// editor.js
// var Api = require('../../utils/api.js');
var app = getApp()
var Menu = require('../../utils/menu.js');
var BASE64 = require('../../utils/base64.js');
var GLOBAL_PAGE
Page({
  data: {
    title: '最热话题',
    hotest: [],
    hidden: false,
    express_ModalHidden:true,
    express_mix:null,
    background:"http://120.27.97.33:91/static/mix/img_word.jpg",
    
    word_mix:"这次是踩死的节奏",
    font_size:"47rpx",
    offsetLeft: "195rpx",
    offsetTop: "425rpx",
    editorSuccess:"",

    watermark:{
      img_url:"http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg" ,
      style:"2",
      // text:"5LiD54mb5LqR5a2Y5YKo",
      text:BASE64.encode("瞎几把车"),
      font:"5b6u6L2v6ZuF6buR",
      fontsize:"1000",
      fill:"d2hpdGU=",
      dissolve:"85",
      gravity:"NorthWest",
      dx:"-20",
      dy:"-20",
    },

    imgWidth:640,
    imgHeight:427,
    imgBackground:"http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg",
    imgSuccess:"http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg?watermark/2/text/5LiD54mb5LqR5a2Y5YKo/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/d2hpdGU=/dissolve/85/gravity/NorthWest/dx/20/dy/20",


  },

  Create: function(e) {
    var watermark = GLOBAL_PAGE.data.watermark
    var img_url = watermark.img_url
    var style = `?watermark/${watermark.style}/`
    var text = `text/${watermark.text}/`
    var font = `font/${watermark.font}/`
    var fontsize = `fontsize/${watermark.fontsize}/`
    var fill = `fill/${watermark.fill}/`
    var dissolve = `issolve/${watermark.dissolve}/`
    var gravity = `gravity/${watermark.gravity}/`
    var dx = `dx/${watermark.dx}/`
    var dy = `dy/${watermark.dy}`
    var success_url = img_url + `${style}${text}${font}${fontsize}${fill}${dissolve}${gravity}${dx}${dy}`
    GLOBAL_PAGE.setData({imgSuccess:success_url})
  },



  // editorSuccess:function (){
  //   var _url = '../private/private?editorSucess=http://alinode-assets.oss-cn-hangzhou.aliyuncs.com/4be39e00-c83b-4f8e-b4e2-76f70b009b1a.jpeg';
  //   // wx.redirectTo({
  //   //   url: _url
  //   // })
  //   app.globalData['editorSuccess']="http://alinode-assets.oss-cn-hangzhou.aliyuncs.com/4be39e00-c83b-4f8e-b4e2-76f70b009b1a.jpeg"
  //   wx.navigateBack( )
  // },

  inputChange: function(e) {
    console.log(e.detail.value)
    var _word = e.detail.value
    GLOBAL_PAGE.setData({
      word_mix:_word,
    })

    var watermark = GLOBAL_PAGE.data.watermark
    watermark.text = BASE64.encode(e.detail.value)
    GLOBAL_PAGE.setData({watermark:watermark})

  },
  size_sliderchange: function(e) {
    console.log(e.detail.value)
    var font_size = e.detail.value
    GLOBAL_PAGE.setData({
      font_size:font_size + "rpx",
    })

    var watermark = GLOBAL_PAGE.data.watermark
    watermark.fontsize = e.detail.value*50
    GLOBAL_PAGE.setData({watermark:watermark})
  },
  x_sliderchange: function(e) {
    console.log(e.detail.value)
    var offsetValue = e.detail.value + 128
    GLOBAL_PAGE.setData({
      offsetLeft:offsetValue + "rpx",
    })

    var watermark = GLOBAL_PAGE.data.watermark
    watermark.dx = e.detail.value
    GLOBAL_PAGE.setData({watermark:watermark})

  },
  y_sliderchange: function(e) {
    var offsetValue = e.detail.value 
    GLOBAL_PAGE.setData({
      offsetTop:offsetValue + "rpx",
    })

    var watermark = GLOBAL_PAGE.data.watermark
    watermark.dy = e.detail.value
    GLOBAL_PAGE.setData({watermark:watermark})
  },

  /**
   * 根据水印数据(watermarkData)，上传后台合成
   * 成功，打开模态框，显示图片
   * 收藏成功，跳转至private，显示
   */
  editorCreate: function(e) {
    // var _word = GLOBAL_PAGE.data.word_mix
    // var _x = parseInt(GLOBAL_PAGE.data.offsetLeft.replace("px,","")) *3 ;
    // var _y = parseInt(GLOBAL_PAGE.data.offsetTop.replace("px,","")) * 3;
    // var watermarkData =  {
    //     bg_img: 'img_word.jpg' ,
    //     word: _word,
    //     size: 100,
    //     x: _x,
    //     y:_y
    //   }
    // Menu.Option.EditorWatermark(watermarkData,GLOBAL_PAGE.editorSuccess)


  },

  //编辑成功，显示模态框,显示图片
  editorSuccess:function(imgUrl){
    GLOBAL_PAGE.setData({
          express_mix:imgUrl,
          editorSuccess:imgUrl,
          express_ModalHidden: false
        })
  },

  //模态框，分享链接
  modalShare: function(e) {
    // app.globalData['editorSuccess']=GLOBAL_PAGE.data.editorSuccess
   console.log("modalShare:" + GLOBAL_PAGE.data.editorSuccess)
    wx.setStorageSync(
        "pre_editor",
        GLOBAL_PAGE.data.editorSuccess
    )
    wx.navigateBack( )
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
      // background:options.imgurl //更改背景图
    })
    GLOBAL_PAGE = this

    var appInstance = getApp()
    console.log(appInstance.globalData)
    // appInstance.setData({aa:321})
    appInstance.globalData.aa = 1
    console.log(appInstance.globalData)
    // this.fetchData();
    // this.fetchExpress()


    wx.getImageInfo({
      // src: GLOBAL_PAGE.data.imgBackground,
      src:"http://image.12xiong.top/0_20161106134319.jpeg",
      success: function (res) {
        console.log(res.width)
        console.log(res.height)
      }
    })
  },
})