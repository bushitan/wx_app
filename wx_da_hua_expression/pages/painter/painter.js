/** painter.js */  
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var QINIU = require('../../utils/qiniu.js');
// var View = require('../../utils/view.js');
// var Menu = require('../../utils/menu.js');
var GLOBAL_PAGE
var global_page

var APP = getApp()

Page({
    data: {
        gatherStatus:1, // 0 关闭 ， 1 打开， 2 上传完成
        master_session:"", //master发帖人session
        masterId:1, //发帖人的master_id

        nickName:"",
        logo: "http://img.12xiong.top/help_logo.png",
        title: "没有文本",
        prizeUrl: "http://img.12xiong.top/help_img.png",
        isGatherOpen: 1, //英雄帖接收锁

        uploadImgUrl:"", //上传图片路径
    },

   
    //一次只能上传1张图
    localImgChoose:function(){
         wx.chooseImage({
            count: 1, 
            sizeType: ['compressed'], 
            success: function(res) {
                var tempFilePath = res.tempFilePaths[0]
                GLOBAL_PAGE.setData({
                    uploadImgUrl:tempFilePath
                })
            },
            fail:function(res){
                console.log(res)
            }
        })
    },

    //返回英雄帖，发帖
    toGather:function(){
        wx.switchTab({
           url: '../gather/gather',
        })
    }, 

    //帮助按钮，发送图片
    sendHelp:function(){
        // var upload_info = { 
        //     "type": 1, 
        //     "master_session": wx.getStorageSync(KEY.session)
        // }
        //Todo 上传图片
        QINIU.UPLOAD( 
            API.QINIU_UPLOAD(),
            wx.getStorageSync(KEY.session),
            GLOBAL_PAGE.data.uploadImgUrl,
            "",
            GLOBAL_PAGE.BindMasterImg
        )            
    },
    // 图片绑定到master名下
    BindMasterImg: function (img) {
        wx.request({
            url: API.GATHER_HELP_Master(),
            method: "GET",
            data: {
                'master_id': GLOBAL_PAGE.data.masterId,
                'img_id': img.img_id,
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") {
                    //上传成功
                    GLOBAL_PAGE.setData({
                        prizeUrl: GLOBAL_PAGE.data.prizeUrl,
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
                                    urls: [GLOBAL_PAGE.data.prizeUrl]
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
   
   

    onShow:function(){
      
       
    },

    //获取gather 的用户设置信息
    getGatherMasterInfo: function () {
        wx.request({
            url: API.GET_GATHER_Master_INFO(),
            method: "GET",
            data: {
                'master_id': GLOBAL_PAGE.data.masterId,
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") {
                    GLOBAL_PAGE.setData({
                        nickName: object.master_info.nick_name,
                        logo: object.master_info.logo,
                        title: object.master_info.title,
                        prizeUrl: object.master_info.prize_url,
                        isGatherOpen: object.master_info.is_gather_open,
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

        GLOBAL_PAGE.setData({
            masterId: option.master_id
        })
        
        GLOBAL_PAGE.getGatherMasterInfo()
    },

    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
       //Todo 登陆过后做的请求
       
    },

    // 分享页面
    onShareAppMessage: function () {
        return {
            title: '求图英雄帖',
            desc: '我想要:' + GLOBAL_PAGE.data.title ,
            path: '/pages/painter/painter?master_id=' + GLOBAL_PAGE.data.masterId 
        }
    },
    
});






