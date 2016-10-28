// editor.js
var Api = require('../../utils/api.js');
var app = getApp()
var globle_page
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
  },
  editorSuccess:function (){
    var _url = '../private/private?editorSucess=http://alinode-assets.oss-cn-hangzhou.aliyuncs.com/4be39e00-c83b-4f8e-b4e2-76f70b009b1a.jpeg';
    // wx.redirectTo({
    //   url: _url
    // })
    app.globalData['editorSuccess']="http://alinode-assets.oss-cn-hangzhou.aliyuncs.com/4be39e00-c83b-4f8e-b4e2-76f70b009b1a.jpeg"
    wx.navigateBack( )
  },

  inputChange: function(e) {
    console.log(e.detail.value)
    var _word = e.detail.value
    globle_page.setData({
      word_mix:_word,
    })
  },
  size_sliderchange: function(e) {
    console.log(e.detail.value)
    var font_size = e.detail.value
    globle_page.setData({
      font_size:font_size + "rpx",
    })
  },
  x_sliderchange: function(e) {
    console.log(e.detail.value)
    var offsetValue = e.detail.value + 128
    globle_page.setData({
      offsetLeft:offsetValue + "rpx",
    })
  },
  y_sliderchange: function(e) {
    var offsetValue = e.detail.value 
    globle_page.setData({
      offsetTop:offsetValue + "rpx",
    })
  },

  //生成表情，打开模态框
  editorCreate: function(e) {

    var _word = globle_page.data.word_mix
    var _x = parseInt(globle_page.data.offsetLeft.replace("px,","")) *3 ;
    var _y = parseInt(globle_page.data.offsetTop.replace("px,","")) * 3;
    
    wx.request({
      url: 'http://120.27.97.33/grid/api/wx/image_mix',
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
          express_mix:"http://120.27.97.33/"+ res.data,
          editorSuccess:"http://120.27.97.33/"+ res.data
        })

        // 显示模态框
        globle_page.setData({
          express_ModalHidden: false
        })
        console.log("http://120.27.97.33/"+ res.data)
      }
    })


      // let url = "http://120.27.97.33:91/grid/api/wx/image_mix"
      // let formData = new FormData();
      // formData.append("name","admin");
      // formData.append("password","admin123");
    
      // fetch(url , {
      //   method: 'POST',
      //   headers: {},
      //   body: formData,
      // }).then((response) => {
      //   if (response.ok) {
      //       return response.json();
      //   }
      // }).then((json) => {
      //   alert(JSON.stringify(json));
        
      // }).catch((error) => {
      //   console.error(error);
      //   //设置图片
      //   globle_page.setData({
      //     express_mix:"http://120.27.97.33:91/"+ res.data
      //   })
      //   // 显示模态框
      //   globle_page.setData({
      //     express_ModalHidden: false
      //   })
      // });
  },
  //模态框，分享链接
  modalShare: function(e) {
    app.globalData['editorSuccess']=globle_page.data.editorSuccess
    wx.navigateBack( )
    // this.setData({
    //   express_ModalHidden: true
    // })
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
      background:options.imgurl //更改背景图
    })
    globle_page = this

    var appInstance = getApp()
    console.log(appInstance.globalData)
    // appInstance.setData({aa:321})
    appInstance.globalData.aa = 1
    console.log(appInstance.globalData)
    // this.fetchData();
    // this.fetchExpress()
  },
})