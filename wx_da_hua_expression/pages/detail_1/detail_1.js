
var GLOBAL_PAGE
var APP = getApp()
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {

    artId:1,
    art:[],
    isLock: "0", //充值权限控制
  },
  

  unLock:function(){
      GLOBAL_PAGE.setData({ isLock: "0" })
  },

  
  
  //获取文章内容
  getArticleContent: function (art_id){
       wx.request
        ({  
        url: API.GetArticleContent(), 
        method:"GET",
        data: {
            session: wx.getStorageSync(KEY.session),
            art_id: art_id,
        },
        success: function(res)
        {
            var object = res.data
            if (object.status == "true") //登陆成功
            {
                if (object.is_permission == "true"){
                    GLOBAL_PAGE.setData({
                        id: object.art_content.id,
                        swiper: object.art_content.swiper,
                        cover: object.art_content.cover,
                        title: object.art_content.title,
                        summary: object.art_content.summary,
                        content: object.art_content.content,

                        // artList: object.art_content
                    })

                    // var article = '<div>我是HTML代码</div>';
                    var article = '<div>' + object.art_content.content + '</div>';
                    var article =  object.art_content.content ;
                    /**
                    * WxParse.wxParse(bindName , type, data, target,imagePadding)
                    * 1.bindName绑定的数据名(必填)
                    * 2.type可以为html或者md(必填)
                    * 3.data为传入的具体数据(必填)
                    * 4.target为Page对象,一般为this(必填)
                    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
                    */
                    var that = this;
                    WxParse.wxParse('article', 'html', article, GLOBAL_PAGE, 5);
                }
                    
                else 
                    wx.redirectTo({
                        url: '../pay/pay?pay_mode=' + object.pay_mode + '&art_id=' + object.art_id + '&price=' + object.price,
                    })
               
            }
            else{

            }        
        },
        fail:function(res) { 
        },
        })
  },



  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(options)
    var that = this
    GLOBAL_PAGE = this

    var art_id = parseInt( options.id )

    var that = this;
    var article = '<p><h1>hahah sdsd</h1>fdsfd<strong>色粉望<span style="background-color: #17365d; "><span style="color: #fdeada;">风而逃给他人给他好听话遇贴</span>就回</span>有</strong></p>'
    WxParse.wxParse('article', 'html', article, GLOBAL_PAGE, 5);
    // GLOBAL_PAGE.getArticleContent(art_id)

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