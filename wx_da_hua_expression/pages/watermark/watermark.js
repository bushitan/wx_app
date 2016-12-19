// watermark.js
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
    
    word_mix:"七牛云存储",
    font_size:"47rpx",
    offsetLeft: "278rpx", //增加128rpx
    offsetTop: "150rpx",
    editorSuccess:"",

    watermark:{
      img_url:"http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg" ,
      style:"2",
      // text:"5LiD54mb5LqR5a2Y5YKo",
      text:BASE64.encode("七牛云存储"),
      font:"5b6u6L2v6ZuF6buR",
      fontsize:"47",
      fill:"d2hpdGU=",
      dissolve:"85",
      gravity:"NorthWest",
      dx:"150",
      dy:"150",
    },

    imgWidth:640,
    imgHeight:427,
    // imgBackground:"http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg",
    imgSuccess:"http://77fmtb.com1.z0.glb.clouddn.com/gogopher.jpg?watermark/2/text/5LiD54mb5LqR5a2Y5YKo/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/d2hpdGU=/dissolve/85/gravity/NorthWest/dx/20/dy/20",


  },


  Create: function(e) {
    var watermark = GLOBAL_PAGE.data.watermark //浅拷贝

    //坐标转换
    var t = GLOBAL_PAGE.transform(GLOBAL_PAGE.data.imgWidth,GLOBAL_PAGE.data.imgHeight,watermark.dx,watermark.dy,watermark.fontsize)
    var t_dx = t.x
    var t_dy = t.y
    var t_fontsize = t.fontsize
    
    var img_url = watermark.img_url
    var style = `?watermark/${watermark.style}/`
    var text = `text/${watermark.text}/`
    var font = `font/${watermark.font}/`
    var fontsize = `fontsize/${t_fontsize}/`
    var fill = `fill/${watermark.fill}/`
    var dissolve = `issolve/${watermark.dissolve}/`
    var gravity = `gravity/${watermark.gravity}/`
    var dx = `dx/${t_dx}/`
    var dy = `dy/${t_dy}`
    var success_url = img_url + `${style}${text}${font}${fontsize}${fill}${dissolve}${gravity}${dx}${dy}`
    GLOBAL_PAGE.setData({imgSuccess:success_url})

    wx.previewImage({
      current: GLOBAL_PAGE.data.imgSuccess, // 当前显示图片的http链接
      urls: [GLOBAL_PAGE.data.imgSuccess] // 需要预览的图片http链接列表
    })
  },


  transform:function(imgw,imgh,x,y,size){
    //以图片左上角为坐标系(0,0)
    // var bg_w = 500,bg_h = 500,bg_r = 2
    // var img_w = 640,img_h = 427
    var img_w = parseInt(imgw)
    var img_h = parseInt(imgh)
    var text_x_rdp = parseInt(x)
    var text_y_rdp = parseInt(y)
    var fontsize_rdp = parseInt(size)
    var rdp=500 //css中设定的固定值

    if (img_w >= img_h){
      var bg_w = img_w, bg_h = img_w //以图片宽
      var temp_h = img_h*bg_w/img_w
      var offset_x = 0
      var offset_y = (bg_h-temp_h)/2
    }
    else {
      var bg_w = img_h ,bg_h = img_h //以图片高
      var temp_w = img_w*bg_h/img_h
      var offset_x = (bg_w-temp_w)/2
      var offset_y = 0
    }

    var text_x = text_x_rdp/rdp*bg_w , text_y = text_y_rdp/rdp*bg_h // 实际对应px
    var text_x_new = parseInt(text_x - offset_x) //新x坐标
    var text_y_new = parseInt(text_y - offset_y) //新y坐标

    var fontsize = fontsize_rdp/rdp*bg_w //px
    var qiniu_twip = 20
    var fontsize_new = parseInt(fontsize*20) //新fontsize

    return {x:text_x_new,y:text_y_new,fontsize:fontsize_new}
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
    watermark.fontsize = e.detail.value
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
     
    GLOBAL_PAGE = this
    console.log(options.imgurl)
    var watermark = GLOBAL_PAGE.data.watermark
    watermark.img_url = options.imgurl
    this.setData({
      watermark:watermark //更改背景图
    })
    

    var appInstance = getApp()
    console.log(appInstance.globalData)
    // appInstance.setData({aa:321})
    appInstance.globalData.aa = 1
    console.log(appInstance.globalData)
    // this.fetchData();
    // this.fetchExpress()


   
  },
})