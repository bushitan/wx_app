
var GLOBAL_PAGE
var APP = getApp()
var API = require('../../utils/api.js');
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    hiddenDetail: false,
    hiddenSpecification: true,
    hiddenBrand: true,
    payNow: true,
    maskVisual: 'hidden',


  //   art:[
  //     {sn:"0",style:"text",msg:"第一篇文章\n\r是的"},
  //     {sn:"1",style:"text",msg:"第一篇文章"},
  //     {sn:"2",style:"image",msg:"http://odhng6tv1.bkt.clouddn.com/swiper25.png"},
  //     {sn:"3",style:"text",msg:"\n\r第一篇文章"},
  //     {sn:"1",style:"text",msg:"第一篇文章"},
  //     {sn:"1",style:"text",msg:"第一篇文章"},
  //     {sn:"1",style:"text",msg:"第一篇文章"},
  //   ]
    artId:1,
    art:[],  
    tao_bao:[],
  },
  
 
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(options)
    var that = this
    GLOBAL_PAGE = this
    //商品详情页
    // wx.request({
    //   url: 'https://api.leancloud.cn/1.1/classes/ProductDetail/' + options.id,
    //   data: {},
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: {
    //     // 设置请求的 header，content-type 默认为 'application/json'
    //     'X-LC-Id': 'NifgaRbeW9zYQU8pP4zxPC9S-gzGzoHsz',
    //     'X-LC-Key': 'Ygv6uGw1TQmpB2Kk18m5TgvX'
    //   },
    //   success: function (res) {
    //     // success
    //     that.setData({
    //       shoppingDetails: res.data.object
    //     })
    //     var goodsPicsInfo = []
    //     var goodspic = res.data.object.swiper
    //     var goodspics = goodspic.substring(0, goodspic.length - 1) //去掉字符串最后一个#
    //     var goodspicsArr = goodspics.split("#") //通过字符串中间间隔 # 来剪断字符串
    //     for (var i = 0; i < goodspicsArr.length; i++) { //
    //       goodsPicsInfo.push({
    //         "picurl": goodspicsArr[i]
    //       })
    //     }
    //     that.setData({
    //       goodsPicsInfo: goodsPicsInfo
    //     })
    //     console.log(that.data.goodsPicsInfo)
    //   }
    // });

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


  // 图片预览
  preview:function(e){
      var current = e.currentTarget.dataset.img_url
      var art = GLOBAL_PAGE.data.art
      var urls = []
      for (var i=0;i<art.length;i++)
          if(art[i].style == "image")
              urls.push(art[i].msg)
      wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: urls, // 需要预览的图片http链接列表
      })
  },

  qrPreview:function(e){
    
    wx.previewImage({
          current: e.currentTarget.dataset.url, // 当前显示图片的http链接
          urls: [e.currentTarget.dataset.url], // 需要预览的图片http链接列表
      })
  },

  //图片加载
  //动态设定加载图片的高，自适应全铺
  bindload:function(e){
    console.log(e.detail,e.currentTarget.dataset.index)
      var _index = e.currentTarget.dataset.index
      var art = GLOBAL_PAGE.data.art
      

      //长度小于屏幕
      if( e.detail.width < APP.globalData.windowWidth){
          art[_index].height = e.detail.height + "px"
      }else{ //长度大于屏幕
          var _r = e.detail.height
          art[_index].height = 690 * e.detail.height / e.detail.width 
          art[_index].height = art[_index].height + "rpx"
      }
     
      GLOBAL_PAGE.setData({
          art: art
      })
  },



  clipBoard:function(e){
      var text =  e.currentTarget.dataset.text
      wx.setClipboardData({
        data: text,
        success: function(res) {
          wx.getClipboardData({
            success: function(res) {
              // console.log(res.data) // data
                wx.showToast({
                  title: '下单链接复制成功',
                  icon: 'success',
                  duration: 2000
                })
            }
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

  // 细节描述
  toDetail: function () {
    this.setData({
      hiddenDetail: false,
      hiddenSpecification: true,
      hiddenBrand: true
    });
  },
  // 规格参数
  toSpecification: function () {
    this.setData({
      hiddenDetail: true,
      hiddenSpecification: false,
      hiddenBrand: true
    });
  },
  // 品牌描述
  toBrand: function () {
    this.setData({
      hiddenDetail: true,
      hiddenSpecification: true,
      hiddenBrand: false
    });
  },
  bindCheckout: function () {
    this.setData({
      payNow: false
    })
  },
  bindClose: function () {
    this.setData({
      payNow: true
    })
  },
  //马上购买事件
  cascadePopup: function() {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-in-out'
    });
    this.animation = animation;
    animation.translateY(-336).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show'
    })
  },
  //点击遮区域关闭弹窗
  cascadeDismiss: function () {
    this.animation.translateY(285).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
  },
  //添加购物车事件方法
  toCart: function (event) {
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-in-out'
    });
    this.animation = animation;
    animation.translateY(-336).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show'
    });
    var that = this
    //获取缓存中的已添加购物车信息
    var cartItems = wx.getStorageSync('cartItems') || []
    console.log(cartItems)
    //
    var exist = cartItems.find(function (ele) {
      return ele.id === event.target.dataset.id
    })
    console.log(exist)
    if (exist) {
      exist.quantity = parseInt(exist.quantity) + 1
    } else {
      cartItems.push({
        id: event.target.dataset.id,
        quantity: 1,
        price: event.target.dataset.price,
        title: event.target.dataset.title,
        goodsPicsInfo: event.target.dataset.pic
      })
    }
    //加入购物车数据，存入缓存
    wx.setStorage({
      key: 'cartItems',
      data: cartItems,
      success: function (res) {
        // success
      }
    })
    //添加购物车的消息提示框
    // wx.showToast({
    //   title: "添加购物车",
    //   icon: "success",
    //   durantion: 2000
    // })
  }
})