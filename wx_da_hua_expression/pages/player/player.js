
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var APP = getApp()
var G
var GLOBAL_PAGE
var i;
var j;
var animation;
var lock = false;
var interval ;


var PAINTER_STEP_LOAD = 0;
var PAINTER_STEP_FREE = 1; //未参与，创建新的
var PAINTER_STEP_BUSY = 2; //正在参与，down上step的
var PAINTER_STEP_SHARE = 3; //待分享
Page({
  data: {
    animationData: {},
    playerImageBg:"",
    // playerImage1:"",
    playerImage:"",
    playerImagePre:"",
    stepList:[], 
    creatUserId:null, //创建者
    joinUserId:null, //当前用户
    nextUserId:null, //下一个用户
    modeUser:1, // 1 别人在画  2继续画   3抢 
    joinStatus: PAINTER_STEP_LOAD , // 0 加载中 1 未参与 ， 2正在参与
    themeId:null,
    themeName:"一起画表情",
    stepId:null,
    imgUrl:"", //下载的图片

    
    playerWidth:0,  //播放器左边偏移量
    playerHeight:0,  //播放器左边偏移量
    playerLeft:0,  //播放器左边偏移量


    lockSnatch:false, //snatch锁锁，防止点太多
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
      var stepList = GLOBAL_PAGE.data.stepList
      if ( i == stepList.length )
      {
        i = 0
      //   GLOBAL_PAGE.hide()
      // GLOBAL_PAGE.click()
      }
        
      var next = i+1
      if ( i == stepList.length -1 )
        next = 0
      
      GLOBAL_PAGE.setData({
        // playerImageBg:stepList[i].img_url,
        playerImage:stepList[i].img_url,
        playerImagePre:stepList[next].img_url,
      })
      console.log(GLOBAL_PAGE.data.playerImage,GLOBAL_PAGE.data.playerImagePre)
      
  },
  same: function (){
      var stepList = GLOBAL_PAGE.data.stepList
      GLOBAL_PAGE.setData({
        playerImageBg:stepList[i].img_url,
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
    // if(lock == false)
    // {
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
    //   lock = true
    // }
    
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
            console.log("getStepList:",res.data)
            if (object.status == "true")
            {
                // 判断用户当前状态，这里的step_list没有逆序- - 
                var _creat_user_id = object.step_list[object.step_list.length-1].user_id
                var _join_user_id = object.step_list[0].user_id
                var _next_user_id = object.step_list[0].next_user_id

                var _modeUser = 1 // 1 别人在画  2继续画   3抢
                if ( _next_user_id==null ) 
                    _modeUser = 3
                else if(_join_user_id == _next_user_id)
                    _modeUser = 2
                else
                    _modeUser = 1

                //如果是继续画，提前给stepId和imgUrl,可以直接跳转了
                var _step_id = object.step_list[object.step_list.length-1].step_id
                var _img_url =  object.step_list[object.step_list.length-1].img_url 
                //设置播放step
                GLOBAL_PAGE.setData({
                    stepList: object.step_list.reverse(), //逆序~~要统一      
                    creatUserId:_creat_user_id, //创建者id
                    joinUserId:_join_user_id,  //已参与用户id
                    nextUserId:_next_user_id, //下一个用户
                    modeUser:_modeUser,
                    themeName:object.theme_name,
                    stepId: _step_id,
                    imgUrl: _img_url, 
                })

                //开始播放
                GLOBAL_PAGE.onPlayer()
            }
            else{
                console.log("getStepList status false")
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })
            }
            
        },
        fail:function(res){
            console.log("getStepList fail")
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },

      })
  },
  onShareAppMessage: function () { 
        return {
            title: '一起画吉吧',
            desc: '邀你来添两笔吉祥如意',
            path: '/pages/player/player?theme_id='+GLOBAL_PAGE.data.themeId
        }
    },

  onLoad:function(option){
    GLOBAL_PAGE = this

    console.log(option)

    //模拟第一个主题创立
  
    GLOBAL_PAGE.setData({
        // playerWidth:APP.globalData.windowWidth,  //播放器左边偏移量
        // playerHeight: parseInt( APP.globalData.windowWidth*0.75 ),  //播放器左边偏移量
        // playerLeft: (APP.globalData.windowWidth-300)/2,
        themeId:option.theme_id,
        stepId:option.step_id,
    })
    
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '抢画啦',
      success:function(){
          wx.hideNavigationBarLoading()
      }
    })

       
    //必须要登陆以后再做的事情
    if(APP.globalData.isLogin == true)
        GLOBAL_PAGE.onInit(option)
    else
        APP.login(option)
  },

  //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
        console.log("painter onInit()")
        GLOBAL_PAGE.getStepList(option.theme_id)
    },

  onUnload:function(){
    // 页面关闭
    clearInterval(interval)
  },

    //111 抢画 
    snatch:function(){
        if (GLOBAL_PAGE.data.lockSnatch){
            wx.showModal({
                title: "抢太快了",
                content:"请休息几秒再抢抢~",
                confirmText:"知道了",
                showCancel:false,
            })
            return
        }
        GLOBAL_PAGE.setData({ lockSnatch:true})
        setTimeout(function() {
             GLOBAL_PAGE.setData({ lockSnatch:false})
        }, 5000)


        wx.request({
            url: API.PAINTER_SNATCH(), 
            method:"GET",
            data: {
                session: wx.getStorageSync(KEY.session),
                theme_id:GLOBAL_PAGE.data.themeId,
                step_id:'',
            },
            success: function(res) {
                var object = res.data
                if (object.status == "true")
                {
                    console.log(object)
                    //设置播放step
                    if(object.is_success== "no_snatch"){
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            confirmText:"继续画",
                            success: function(res) {
                                if (res.confirm) {
                                    var _join_status = object.join_status
                                    var _step_id = object.step_id
                                    var _img_url = object.img_url
                                    var _theme_name = object.theme_name
                                    var url = '../painter/painter?step_id='+_step_id+'&img_url='+_img_url+'&theme_name='+_theme_name +'&join_status='+_join_status
                                    wx.redirectTo({
                                         url: url
                                    })
                                }
                            }
                        })
                    }
                    else if( object.is_success== "true")
                    {
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            showCancel:false,
                        })
                        GLOBAL_PAGE.setData({
                            joinStatus:PAINTER_STEP_BUSY,
                            themeName:object.theme_name ,
                            stepId: object.step_id,
                            imgUrl:object.img_url, 
                        })
                        GLOBAL_PAGE.continueToPainter()
                    }
                    
                    else  //抢画失败，继续
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            confirmText:"画一幅",
                            // showCancel:false,
                            success: function(res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                    url: '../painter/painter'
                                    })
                                }
                            }
                        })
                }
                else{
                    console.log("snatch  status false")
                       wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })

                }
               
            },
            fail:function(res){
                console.log("snatch fail")
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })
            },
        })
    },

    continueToPainter: function(e) {
        var url = '../painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_BUSY
        wx.redirectTo({
            url: url
        })
    },  



//     //导航：画布页面
//   navigateToPainter: function(step_id,img_url,theme_name) {
//     var url = '../painter/painter?step_id='+step_id+'&img_url='+img_url+'&theme_name='+theme_name
//     wx.redirectTo({
//       url: url
//     })
//   }, 
    // 5 返回一起画主页
    navigateToSwitch: function() {
        wx.switchTab({
            url: "../together/together",
            success: function (e) {  
                var page = getCurrentPages().pop();  
                if (page == undefined || page == null) return;  
                page.onShow();  
            }  
        })
    },


  
    previewStep:function(event){
        wx.previewImage({
        current: event.currentTarget.dataset.img_url, // 当前显示图片的http链接
        urls: [event.currentTarget.dataset.img_url] // 需要预览的图片http链接列表
      })
    },
})