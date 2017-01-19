
var API = require('../../utils/api.js');
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
    themeName:"",
    themeId:null,
    stepId:null,
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
      if ( i == emoticon.length )
      {
        i = 0
      //   GLOBAL_PAGE.hide()
      // GLOBAL_PAGE.click()
      }
        
      var next = i+1
      if ( i == emoticon.length -1 )
        next = 0
      
      GLOBAL_PAGE.setData({
        // playerImageBg:emoticon[i].img_url,
        playerImage:emoticon[i].img_url,
        playerImagePre:emoticon[next].img_url,
      })
      
  },
  same: function (){
      var emoticon = GLOBAL_PAGE.data.emoticon
      GLOBAL_PAGE.setData({
        playerImageBg:emoticon[i].img_url,
      })
  },
  onPlayer:function(){
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
    GLOBAL_PAGE.click()
  },
  click: function(){
    if(lock == false)
    {
      interval = setInterval(function() {

        // console.log(j,j %2)
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

  


  getStepList:function(theme_id){
      wx.request({
        url: API.PAINTER_STEP_QUERY(), 
        method:"GET",
        data: {
            session: wx.getStorageSync(KEY.session),
            theme_id:theme_id,
        },
        success: function(res) {
            var object = res.data
            if (object.status == "true")
            {
                console.log(object)
                //设置播放step
                GLOBAL_PAGE.setData({
                    emoticon: object.step_list,
                    themeName:object.theme_name,
                })

                //开始播放
                // GLOBAL_PAGE.onPlayer()
            }
            else
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },

      })
  },

  onLoad:function(option){
    GLOBAL_PAGE = this

    console.log(option)

    //模拟第一个主题创立
    option = {
        theme_id:5,
        step_id:3,
        step_number:1
    }
    GLOBAL_PAGE.setData({
        themeId:option.theme_id,
        stepId:option.step_id,
    })

    GLOBAL_PAGE.getStepList(option.theme_id)
    //测试数据
    // GLOBAL_PAGE.setData({
    //     emoticon:wx.getStorageSync(KEY.emoticon)
    // })
    

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


  //抢画
  snatch:function(){
      wx.request({
        url: API.PAINTER_SNATCH(), 
        method:"GET",
        data: {
            session: wx.getStorageSync(KEY.session),
            theme_id:GLOBAL_PAGE.data.themeId,
            step_id:GLOBAL_PAGE.data.stepId,
        },
        success: function(res) {
            var object = res.data
            if (object.status == "true")
            {
                console.log(object)
                //设置播放step
                // GLOBAL_PAGE.setData({
                //     emoticon: object.step_list,
                //     themeName:object.theme_name,
                // })
                if( object.is_success== "true")
                {
                    wx.setStorageSync(KEY.PAINTER_STEP_INFO,{
                        step_id:object.step_id,
                        img_url:object.img_url,
                        theme_name:object.theme_name
                    }),
                    
                    GLOBAL_PAGE.navigateToPainter(object.step_id,object.img_url,object.theme_name)

                }
                   
                else 
                    wx.showModal({
                        title: object.title,
                        content:object.is_success,
                        showCancel:false,
                    })
                //开始播放
                // GLOBAL_PAGE.onPlayer()
                
            }
            else
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },

      })
     
  },

    //导航：画布页面
  navigateToPainter: function(step_id,img_url,theme_name) {
    var url = '../painter/painter?step_id='+step_id+'&img_url='+img_url+'&theme_name='+theme_name
    wx.redirectTo({
      url: url
    })
  }, 

  
    bindload:function(e){
      console.log(e)
    },
})