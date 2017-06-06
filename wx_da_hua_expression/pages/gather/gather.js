// gather.js
var API = require('../../utils/api.js');
// var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');
var Render = require('../../utils/render.js');
var KEY = require('../../utils/storage_key.js');
var BASE64 = require('../../utils/base64.js');

var APP = getApp()
var GLOBAL_PAGE
var appInstance
var i = 0

var MASTER_USER_INFO, GATHER_OPEN
Page({
  data: {
    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,
    joinHeight:203,

    //页面渲染数据
    emoticon:[],
    
    //斗图英雄帖
    masterId: 1,//master的id
    logo: "../../images/emoji_log.jpg",
    nickName: "昵称",
    title: "没有文本",
    qrUrl:"",
    prizeUrl: "../../images/emoji_log.jpg",
    isGatherOpen: 1, //英雄帖接收锁

    //英雄帖
    gatherImg:"http://img.12xiong.top/help_tie_bg1.jpg?watermark/3/image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9xci5qcGc=/dissolve/50/gravity/SouthEast/dx/20/dy/20/image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9sb2dvLmpwZz9pbWFnZU1vZ3IyL3RodW1ibmFpbC84eDgvZm9ybWF0L2pwZw==/dissolve/50/gravity/NorthWest/dx/280/dy/20/ws/0.4/text/5aSn5ZCJ5ouc5bm0/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/YmxhY2s=/dissolve/85/gravity/NorthWest/dx/285/dy/591",
  },

  onShow:function(){
     var gather_lock = wx.getStorageSync('GATHER_OPEN')
     GLOBAL_PAGE.setData({
         isGatherOpen:gather_lock
     })
     GLOBAL_PAGE.GetMasterData()
  },

  //预览分享图
  previewGatherImg: function () {
      wx.previewImage({
          urls: [GLOBAL_PAGE.data.gatherImg],
      })
  },

  toPainter:function(){
      wx.navigateTo({
        url: '../painter/painter',
      })
  },

  toGatherList:function(){
      wx.navigateTo({
        url: '../gather_list/gather_list',
      })
  },


  GetMasterData:function(){
      wx.request({
          url: API.GET_GATHER_USER_INFO(),
          method: "GET",
          data: {
              'session': wx.getStorageSync(KEY.session),
          },
          success: function (res) {
              var object = res.data
              console.log(object)
              if (object.status == "true") {
                  GLOBAL_PAGE.setData({
                      masterId: object.master_info._master,
                      nickName: object.master_info.nick_name,
                      logo: object.master_info.logo,
                      title: object.master_info.title,
                      qrUrl: object.master_info.qr_url,
                      prizeUrl: object.master_info.prize_url,
                      isGatherOpen: object.master_info.is_gather_open,
                    //   emoticon: object.img_list,
                  })
                  Render.emoticon(GLOBAL_PAGE, object.img_list) //加载获取表情
                  wx.setStorageSync(MASTER_USER_INFO, object.master_info) //本地记录
                  GLOBAL_PAGE.createQR()// 生成二维码

              }
          },
          fail: function (res) {
              wx.showModal({
                  title: '网络连接失败，请重试',
                  showCancel: false,
              })
          }
      })
  },

  createQR: function () {
      var logo = BASE64.encode(GLOBAL_PAGE.data.logo)
      var qr = BASE64.encode(GLOBAL_PAGE.data.qrUrl)
      var title = BASE64.encode(GLOBAL_PAGE.data.title)

      var water_5 = 'http://img.12xiong.top/help_tie_bg1.jpg?watermark/3/' 
      + 'image/' + qr+'/100/gravity/SouthEast/dx/20/dy/20/' 
      + 'image/'+ logo+'/dissolve/50/gravity/NorthWest/dx/280/dy/20/ws/0.4/' 
      + 'text/' + title+'/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/YmxhY2s=/dissolve/85/gravity/NorthWest/dx/285/dy/591'
      console.log(water_5)




    //   var url = "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKVjOuco39iayByJDagvdHXj1Jsr6jGeF0aHkWMygvVypmSdEyVmZhruaZeO6a7le54fIXfyupibicdg/0"
    //   // var url = "https://olhvkds73.qnssl.com/logo.png"
    //   var r = BASE64.encode(url)
    //   console.log(r)
    //   console.log(BASE64.decode(r))



    GLOBAL_PAGE.setData({ 
        gatherImg: water_5
    })
  },


  menuShare: function (e) {
      var current = e.currentTarget.dataset.yun_url
      var urls = []
      var e = GLOBAL_PAGE.data.emoticon
      for (var i = 0; i < e.length; i++) {
          urls.push(e[i].yun_url)
      }
      wx.previewImage({
          current: current, // 当前显示图片的http链接
          // urls:yun_list
          urls: urls, // 需要预览的图片http链接列表
          success: function (res) {
              console.log(res)
          },
          fail: function (res) { console.log(res) },
          comlete: function (res) {
              console.log(res)
          },
      })
  },











  /** 10 渲染表情 */
  renderEmoticon:function(){
    //根据条件选择emoticon，重新渲染
    var c_id = GLOBAL_PAGE.data.selectCategory.category_id 
    var e_storage = wx.getStorageSync(Key.emoticon) //存储
    var e_render = [] //预渲染
    if ( c_id == undefined || c_id == null)
    {
       e_render = e_storage
    } else
    {
      for (var i=0;i<e_storage.length;i++)
      {
        if(e_storage[i].category_id == c_id)
          e_render.push(e_storage[i])
      }
    }
     
    Render.emoticon(this,e_render)
  },
 
  /** 11 渲染目录 */
  renderCategory:function(){
    Render.category(this,wx.getStorageSync("category"))
  },



  /**
   *  页面加载
   */
  onLoad: function (option) {   
      var water_img = "http://img.12xiong.top/help_tie_bg1.jpg?watermark/1/image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9xci5qcGc=/50/gravity/SouthEast/dx/20/dy/20"

      var water_text = "http://img.12xiong.top/help_tie_bg1.jpg?watermark/2/text/5aSn5ZCJ5ouc5bm0/font/5b6u6L2v6ZuF6buR/fontsize/3498/fill/YmxhY2s=/dissolve/85/gravity/NorthWest/dx/285/dy/591"

      var water_3 = "http://img.12xiong.top/help_tie_bg1.jpg?watermark/3/image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9xci5qcGc=/50/gravity/SouthEast/dx/20/dy/20/text/5aSn5ZCJ5ouc5bm0/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/YmxhY2s=/dissolve/85/gravity/NorthWest/dx/285/dy/591/image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9sb2dvLmpwZz9pbWFnZU1vZ3IyL3RodW1ibmFpbC8xNzB4MjQwL2Zvcm1hdC9qcGc=/50/gravity/NorthWest/dx/20/dy/20"

      var water_4 = 'http://img.12xiong.top/help_tie_bg1.jpg?watermark/3/'+
'image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9xci5qcGc=/dissolve/50/gravity/SouthEast/dx/20/dy/20/' +
'image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9sb2dvLmpwZz9pbWFnZU1vZ3IyL3RodW1ibmFpbC8xNzB4MjQwL2Zvcm1hdC9qcGc=/dissolve/50/gravity/NorthWest/dx/280/dy/20/ws/1' +
'text/5aSn5ZCJ5ouc5bm0/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/YmxhY2s=/dissolve/85/gravity/NorthWest/dx/285/dy/591'

      var water_5 = 'http://img.12xiong.top/help_tie_bg1.jpg?watermark/3/' +
          'image/aHR0cDovL2ltZy4xMnhpb25nLnRvcC9oZWxwX3RpZV9xci5qcGc=/dissolve/100/gravity/SouthEast/dx/20/dy/20/' +    'image/aHR0cDovL3d4LnFsb2dvLmNuL21tb3Blbi92aV8zMi9RMGo0VHdHVGZUS1ZqT3VjbzM5aWF5QnlKRGFndmRIWGoxSnNyNmpHZUYwYUhrV015Z3ZWeXBtU2RFeVZtWmhydWFaZU82YTdsZTU0ZklYZnl1cGliaWNkZy8w/dissolve/50/gravity/NorthWest/dx/280/dy/20/ws/0.4/' +
          'text/5aSn5ZCJ5ouc5bm0/font/5b6u6L2v6ZuF6buR/fontsize/1000/fill/YmxhY2s=/dissolve/85/gravity/NorthWest/dx/285/dy/591'
    console.log(water_5)
    var url = "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKVjOuco39iayByJDagvdHXj1Jsr6jGeF0aHkWMygvVypmSdEyVmZhruaZeO6a7le54fIXfyupibicdg/0"
    // var url = "https://olhvkds73.qnssl.com/logo.png"
    var r = BASE64.encode(url)
    console.log(r)
    console.log(BASE64.decode(r))
    

    GLOBAL_PAGE = this
    MASTER_USER_INFO = 'MASTER_USER_INFO'
    //1 page初始化高宽
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 42,  //category框高度42px ,join框高度160 || 0
      categoryScrollWidth:APP.globalData.windowWidth, // 客服50 
    })
    //测试session
    console.log("session:", wx.getStorageSync('session') )

    //正式登陆
    // GLOBAL_PAGE.login()

    //必须要登陆以后再做的事情
      if(APP.globalData.isLogin == true)
          GLOBAL_PAGE.onInit(option)
      else
          APP.login(option)
    
        
  },

  //必须要登陆以后发起的请求，在这里完成
  onInit:function(option){
      //Todo 登陆过后做的请求
      
  },


  // 分享页面
  onShareAppMessage: function () {
      return {
          title: '求图',
          desc: '我想要"' + GLOBAL_PAGE.data.title + '"的图，求助',
          path: '/pages/painter/painter?master_id=' + masterId
      }
  },

})




