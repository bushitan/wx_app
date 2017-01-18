var KEY = require('../../utils/storage_key.js');
var G
var GLOBAL_PAGE
var i;
var j;
var animation;
var lock = false;
var interval ;
Page({
  data: {
    animationData: {},
    playerImageBg:"",
    // playerImage1:"",
    playerImage:"",
    playerImagePre:"",
    emoticon:[],
  },
  show:function (){
      animation.opacity(1).step()
      G.setData({
          animationData:animation.export()
      })
  },
  hide:function (){
      animation.opacity(0).step({ duration: 0 })
      G.setData({
          animationData:animation.export()
      })
  },
  setImage:function (){
      var emoticon = GLOBAL_PAGE.data.emoticon
      GLOBAL_PAGE.setData({
        // playerImageBg:emoticon[i].yun_url,
        playerImage:emoticon[i].yun_url,
        playerImagePre:emoticon[i+1].yun_url,
      })
      
  },
  same: function (){
      var emoticon = GLOBAL_PAGE.data.emoticon
      GLOBAL_PAGE.setData({
        playerImageBg:emoticon[i].yun_url,
      })
  },
  onShow:function(){
    animation = wx.createAnimation({
      duration: 700,
        timingFunction: 'ease',
    })

    // this.animation = animation

    G = this
    i = 0;
    j=0;

    // GLOBAL_PAGE.same()
    GLOBAL_PAGE.hide()
    // i++
    GLOBAL_PAGE.click()
  },
  click: function(){
    if(lock == false)
    {
      interval = setInterval(function() {

        console.log(j,j %2)
        if( j %2 == 0)
        {
            GLOBAL_PAGE.setImage()
            GLOBAL_PAGE.show()
        }
        else {
            GLOBAL_PAGE.same()
            GLOBAL_PAGE.hide()
            i++
        }
        j++
    }.bind(this), 1000)
      lock = true
    }
    
  },

  

  rotateAndScale: function () {
    // 旋转同时放大
    this.animation.rotate(45).scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateThenScale: function () {
    // 先旋转后放大
    this.animation.rotate(45).step()
    this.animation.scale(2, 2).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  rotateAndScaleThenTranslate: function () {
    // 先旋转同时放大，然后平移
    this.animation.rotate(45).scale(2, 2).step()
    this.animation.translate(100, 100).step({ duration: 1000 })
    this.setData({
      animationData: this.animation.export()
    })
  },

  
  onLoad:function(option){
    GLOBAL_PAGE = this

    //测试数据
    GLOBAL_PAGE.setData({
        emoticon:wx.getStorageSync(KEY.emoticon)
    })
    

    // console.log("onLoad:",e)

    
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '抢画啦',
      success:function(){
          wx.hideNavigationBarLoading()

          // GLOBAL_PAGE.setData({
          //     playerImage:option.img_url
          // })
      }
    })
    
  },
  onUnload:function(){
    // 页面关闭
    clearInterval(interval)
  },



  snatch:function(){
      GLOBAL_PAGE.navigateToPainter()
  },

    //导航：画布页面
  navigateToPainter: function(e) {
    var url = '../painter/painter'
    wx.navigateTo({
      url: url
    })
  }, 

  
    bindload:function(e){
      console.log(e)
    },
})