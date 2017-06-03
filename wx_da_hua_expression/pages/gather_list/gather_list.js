// var base64 = require("../images/base64");
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
var QINIU = require('../../utils/qiniu.js');
var GLOBAL_PAGE;
Page({
    data:{
        // historyImg: "../../images/emoji_log.jpg",
        logo: "../../images/emoji_log.jpg",
        nickName:"this.丰兄",
        title:"没有文本",
        prizeUrl:"../../images/emoji_log.jpg",
        isGatherOpen:1, //英雄帖接收锁
        switchWord:"接收"
    },
    back:function(){
        //TODO
        //2种上传方法
        //1,图片不更新，直接上传
        //2、图片更新，在上传图片后七牛callback实现
        wx.request({
            url: API.SET_GATHER_USER_INFO(),
            method: "GET",
            data: {
                'session': wx.getStorageSync(KEY.session),
                'logo': GLOBAL_PAGE.data.logo,
                'title': GLOBAL_PAGE.data.title,
                'prize_url': GLOBAL_PAGE.data.prizeUrl,
                'is_gather_open': GLOBAL_PAGE.data.isGatherOpen,
            },
            success: function (res) {
                var object = res.data
                console.log(object)
                if (object.status == "true") {
                    
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

    onLoad: function(){
        GLOBAL_PAGE = this 
        // this.setData({
        //     icon: base64.icon20
        // });


        var gather_lock = wx.getStorageSync('GATHER_OPEN')
        if (gather_lock != false)
            wx.setStorageSync('GATHER_OPEN',true)
        GLOBAL_PAGE.setData({
            isGatherOpen:gather_lock
        })

        GLOBAL_PAGE.getGatherUserInfo()
    }
});