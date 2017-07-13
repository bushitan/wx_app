
var GLOBAL_PAGE
var APP = getApp()
var API = require('../../utils/api.js');

var WxParse = require('../../wxParse/wxParse.js');
var STORY_TRACE = "story_trace"
Page({
  data: {

    artId:1,
    storyId:"1",
    stepCurrent:"",
    hiddenBackBtn:true,
    art:[],  
    article:'',
    tao_bao:[],

    canIUseRichText:false,
  },
  
  //To 订单页面
  toOrder:function(){
      wx.navigateTo({
          url: '../order/order',
      })
  },




  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    //   console.log(options, wx.getSystemInfoSync)

    var story_id = options.story_id
    // var story_id = 1
    var that = this
    GLOBAL_PAGE = this
    GLOBAL_PAGE.setData({
      artId:options.art_id,
      storyId: story_id,
    })
    GLOBAL_PAGE.setData({
        canIUseRichText: wx.canIUse('rich-text')
    })
    var story_trace = wx.getStorageSync(STORY_TRACE)
    if (story_trace == "")
    {
        wx.setStorageSync(STORY_TRACE,{})
        GLOBAL_PAGE.nextAndBack("")
    }else if (story_trace[story_id]) {
            GLOBAL_PAGE.setData({
                stepCurrent: story_trace[story_id]
            })
            GLOBAL_PAGE.nextAndBack(story_trace[story_id])
            // wx.setStorageSync(STORY_TRACE, {})
    }
    var article = '<p><h1>hahah sdsd</h1>fdsfd<strong>色粉望<span style="background-color: #17365d; "><span style="color: #fdeada;">风而逃给他人给他好听话遇贴</span>就回</span>有</strong></p>'
    WxParse.wxParse('article', 'html', article, GLOBAL_PAGE, 5);
     // GLOBAL_PAGE.test(options)
    // wx.setNavigationBarColor({
    //     frontColor: '#ffffff',
    //     backgroundColor: '#ff0000',
    //     animation: {
    //         duration: 400,
    //         timingFunc: 'easeIn'
    //     }
    // })
  },

  test: function (options) {
    //   console.log(options)
      wx.request({
          url: API.ARTICALE() , 
          method:"GET",
          data: {
            // "art_id":options.art_id,
            "story_id": GLOBAL_PAGE.data.storyId,
            "step_current": GLOBAL_PAGE.data.stepCurrent,
          },
          success: function(res) {
              console.log("collect success:",res.data)
              var object = res.data
              if (object.status == "true")
              {
                  //设置基础信息
                  GLOBAL_PAGE.setData({
                      swiper:res.data.swiper,
                      title:res.data.title,

                      stepCurrent: res.data.step_current,
                      stepNext: res.data.step_next,
                    //   art: res.data.content,
                    //   tao_bao:res.data.tao_bao,
                  })

                    //设置文章内容
                  var article = res.data.content
                //   if (GLOBAL_PAGE.data.canIUseRichText)
                //       GLOBAL_PAGE.UseRichText(article)
                //   else
                      GLOBAL_PAGE.UseWxParse(article)

                    //浏览记录本地存储{ '故事id':'当前步骤step_current' }
                  var trace = wx.getStorageSync(STORY_TRACE)
                  trace[GLOBAL_PAGE.data.storyId.toString()] = res.data.step_current
                  wx.setStorageSync(STORY_TRACE, trace)
                //   var next = res.data.step_next

                    //滚动到初始位置
                  wx.pageScrollTo({
                      scrollTop: 0
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

  UseRichText: function (article) {
      GLOBAL_PAGE.setData({
          article: article,
      })
   },
  UseWxParse: function (article) { 
        WxParse.wxParse('article', 'html', article, GLOBAL_PAGE, 5)
  },

    //进入下一篇
    nextArticle:function(e){
        var next_id = e.currentTarget.dataset.next_id
        var step_current = GLOBAL_PAGE.data.stepCurrent
        GLOBAL_PAGE.nextAndBack(step_current + "," + next_id)
        // GLOBAL_PAGE.setData({
        //     stepCurrent: step_current + "," + next_id,
        // })
        // GLOBAL_PAGE.test()

    },
    //返回上一篇
    backArticle:function(){
        var temp = GLOBAL_PAGE.data.stepCurrent
        temp = temp.split(",")
        temp.pop()
        var step_current = temp.join(",")
        GLOBAL_PAGE.nextAndBack(step_current)

    },
    //进入新的文章
    nextAndBack: function (step_current){
        var hiddenBackBtn = true
        if (step_current.split(',').length > 1 )
            hiddenBackBtn = false
        GLOBAL_PAGE.setData({
            stepCurrent: step_current,
            hiddenBackBtn: hiddenBackBtn,
        })
        GLOBAL_PAGE.test()
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