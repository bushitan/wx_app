// var base64 = require("../images/base64");
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var QINIU = require('../../utils/qiniu.js');
var GLOBAL_PAGE;

var MASTER_USER_INFO, GATHER_OPEN
Page({
    data:{
        masterId: 1, //master的id
        logo: "../../images/emoji_log.jpg",
        nickName:"昵称",
        title:"没有文本",
        prizeUrl:"../../images/emoji_log.jpg",
        isGatherOpen:1, //英雄帖接收锁

        switchWord:"接收"
    },
    back:function(){
        //1 检查用户信息，未改动返回
        var master_info = wx.getStorageSync(MASTER_USER_INFO)
        //2图片不一样，上传图片，返回
        if (master_info.prize_url != GLOBAL_PAGE.data.prizeUrl){ 
            QINIU.UPLOAD(
                API.QINIU_UPLOAD(), //上传url
                wx.getStorageSync(KEY.session), //用户session
                GLOBAL_PAGE.data.prizeUrl,  //图片本地地址
                "",
                GLOBAL_PAGE.setMasterUserInfo
            )  
            return 
        }

        //3其他信息改动，更新
        var isChange = false
        if (master_info.logo != GLOBAL_PAGE.data.logo)
            isChange = true
        if (master_info.nick_name != GLOBAL_PAGE.data.nickName)
            isChange = true
        if (master_info.title != GLOBAL_PAGE.data.title)
            isChange = true
        if (master_info.is_gather_open != GLOBAL_PAGE.data.isGatherOpen)
            isChange = true
        if (isChange) {
            GLOBAL_PAGE.setMasterUserInfo({ yun_url: GLOBAL_PAGE.data.prizeUrl})
            return
        }
        else 
            wx.switchTab({
                url: '../gather/gather',
            })
    },

    setMasterUserInfo: function (img) {
        wx.request({
            url: API.SET_GATHER_USER_INFO(),
            method: "GET",
            data: {
                'session': wx.getStorageSync(KEY.session),
                'logo': GLOBAL_PAGE.data.logo,
                'nick_name': GLOBAL_PAGE.data.nickName,
                'title': GLOBAL_PAGE.data.title,
                'prize_url': img.yun_url,
                'is_gather_open': GLOBAL_PAGE.data.isGatherOpen,
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") {
                    wx.switchTab({
                        url: '../gather/gather',
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

    //logo开关
    logoSwitchChange: function (e) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.getUserInfo({
                        success: function (res) {
                            var userInfo = res.userInfo
                            var nickName = userInfo.nickName
                            var avatarUrl = userInfo.avatarUrl
                            var gender = userInfo.gender //性别 0：未知、1：男、2：女
                            var province = userInfo.province
                            var city = userInfo.city
                            var country = userInfo.country
                            console.log(userInfo)
                            GLOBAL_PAGE.setData({
                                logo: avatarUrl,
                                nickName: nickName,
                            })
                        }
                    })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        });
    },

    //改变标题
    inputChange: function (e) {
        
        GLOBAL_PAGE.setData({
            title: e.detail.value 
        })
    },

    //设置奖励图
    prizeImgChange: function (e) {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            success: function (res) {
                var tempFilePath = res.tempFilePaths[0] //图片 
                console.log(res.tempFilePaths)
                GLOBAL_PAGE.setData({
                    prizeUrl: tempFilePath
                })
                
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },


    //接收开关
    gatherSwitchChange: function (e){
        console.log('switch1 发生 change 事件，携带值为', e.detail.value)
        GLOBAL_PAGE.setData({
            isGatherOpen:e.detail.value?1:0,
            switchWord: e.detail.value?'接收':"关闭",
        })
        wx.setStorageSync('GATHER_OPEN',e.detail.value)
    },

    


    //获取gather 的用户设置信息
    getGatherUserInfo:function(){
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
                        masterId: object.master_info.master_id,
                        logo: object.master_info.logo,
                        nickName: object.master_info.nick_name,
                        title: object.master_info.title,
                        prizeUrl: object.master_info.prize_url,
                        isGatherOpen: object.master_info.is_gather_open,
                    })
                    wx.setStorageSync(MASTER_USER_INFO, object.master_info )
             
                }
            },
            fail: function (res) {
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel: false,
                })
            },
            complete:function(){
                //将用户数据存到本地
            }
        })
    },
    setMasterStorage:function(){

        wx.setStorageSync('MASTER_USER_INFO', )
    },

    onLoad: function(){
        GLOBAL_PAGE = this 

        MASTER_USER_INFO = 'MASTER_USER_INFO'
        GATHER_OPEN = 'GATHER_OPEN'

        // var gather_lock = wx.getStorageSync(GATHER_OPEN)
        // if (gather_lock != false)
        //     wx.setStorageSync(GATHER_OPEN,true)
        // GLOBAL_PAGE.setData({
        //     isGatherOpen:gather_lock
        // })

        var master_info = wx.getStorageSync(MASTER_USER_INFO)
        if (master_info == "") //若本地还未加载master信息，请求更新
            GLOBAL_PAGE.getGatherUserInfo()
        else //master信息已经存储
            GLOBAL_PAGE.setData({
                logo: master_info.logo,
                nickName: master_info.nick_name,
                title: master_info.title,
                prizeUrl: master_info.prize_url,
                isGatherOpen: master_info.is_gather_open,
            })
       
        
        // GLOBAL_PAGE.getGatherUserInfo()
    },


    // 分享页面
    onShareAppMessage: function () {
        return {
            title: '求图',
            desc: '我想要"' + GLOBAL_PAGE.data.title + '"的图，求助',
            path: '/pages/painter/painter?master_id=' + GLOBAL_PAGE.data.masterId 
        }
    },
});