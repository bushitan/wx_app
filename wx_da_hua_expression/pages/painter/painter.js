/** painter.js */  
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
// var View = require('../../utils/view.js');
// var Menu = require('../../utils/menu.js');
var GLOBAL_PAGE
var global_page
// var context
var context_lancet
var context_1
var point_lancet = []

var APP = getApp()
var PAINTER_STEP_LOAD = 0;
var PAINTER_STEP_FREE = 1; //未参与，创建新的
var PAINTER_STEP_BUSY = 2; //正在参与，down上step的
var PAINTER_STEP_SHARE = 3; //待分享

var MODE_PENCIL = 1;
var MODE_ERASER = 2;
Page({
    data: {
        gatherStatus:1, // 0 关闭 ， 1 打开， 2 上传完成

        logo: "../../images/emoji_log.jpg",
        title: "没有文本",
        prizeUrl: "../../images/emoji_log.jpg",
        isGatherOpen: 1, //英雄帖接收锁

        previewImgUrl:"",
        // prizeImgURL:,
    },

   
    //一次只能上传1张图
    localImgChoose:function(){
         wx.chooseImage({
            count: 1, 
            sizeType: ['compressed'], 
            success: function(res) {

                var tempFilePath = res.tempFilePaths[0]
                GLOBAL_PAGE.setData({
                    previewImgUrl:tempFilePath
                })
                // GLOBAL_PAGE.uploadPrepare(1,res.tempFilePaths)
                // var tempFilePath = res.tempFilePaths[0] //图片 
                // console.log( res.tempFilePaths)           
                // GLOBAL_PAGE.uploadFile(tempFilePath)

            },
            fail:function(res){
                console.log(res)
            }
        })
    },

    toGather:function(){
        wx.switchTab({
           url: '../gather/gather',
        })
    }, 

    //帮助按钮，发送图片
    sendHelp:function(){
        //Todo 上传图片

        //图片绑定到master名下
        wx.request({
            url: API.GATHER_HELP_Master(),
            method: "GET",
            data: {
                'master_session': wx.getStorageSync(KEY.session),
                'img_url': wx.getStorageSync(KEY.session),
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") {
                    //上传成功
                    GLOBAL_PAGE.setData({
                        prizeUrl: GLOBAL_PAGE.data.previewImgUrl,
                        gatherStatus: 2,
                    })
                    wx.showModal({
                        title: "帮助成功",
                        content: '点击右上角"⋮"，可保存图片',
                        confirmText: "看奖励",
                        cancelText: "稍后再看",
                        success: function (res) {
                            if (res.confirm) { //发图成功，预览奖励
                                wx.previewImage({
                                    urls: [GLOBAL_PAGE.data.previewImgUrl]
                                })
                            } else if (res.cancel) { //点击取消，

                            }
                        }
                    })
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
    //保存奖励图片
    prizeSave:function(){
        wx.previewImage({
          // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
            urls: [GLOBAL_PAGE.data.prizeUrl]
        })
    },
   
    toPrivate:function(){
        wx.switchTab({
           url: '../private/private',
        })
    },
    



    onShow:function(){
        var _img_select = wx.getStorageSync(KEY.PAINTER_IMAGE_SELECT) 
        if( _img_select == "" ) //没有选择图片
            return
        else{
            wx.setStorageSync(KEY.PAINTER_IMAGE_SELECT,"")  //立马清除缓存~~避免出错
            GLOBAL_PAGE.imgSelectMode(_img_select)
        }
       
    },

    //获取gather 的用户设置信息
    getGatherMasterInfo: function () {
        wx.request({
            url: API.GET_GATHER_Master_INFO(),
            method: "GET",
            data: {
                'master_session': wx.getStorageSync(KEY.session),
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") {
                    GLOBAL_PAGE.setData({
                        logo: object.user_info.logo,
                        title: object.user_info.title,
                        prizeUrl: object.user_info.prize_url,
                        isGatherOpen: object.user_info.is_gather_open,
                    })
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

    onLoad(option) {
        global_page = this
        GLOBAL_PAGE = this

        GLOBAL_PAGE.getGatherMasterInfo()
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
       //Todo 登陆过后做的请求
       
    },
    
});






