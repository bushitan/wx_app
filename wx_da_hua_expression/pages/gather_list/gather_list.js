// var base64 = require("../images/base64");
var GLOBAL_PAGE;
Page({
    data:{
        historyImg: "../../images/emoji_log.jpg",
        isGatherOpen:true, //英雄帖接收锁
    },
    back:function(){
        wx.navigateBack({
          delta: 1, 
        })
    },
    previewToPainter(){
        wx.previewImage({
          urls:[GLOBAL_PAGE.data.historyImg],
        })
    },
    
    gatherSwitchChange: function (e){
        console.log('switch1 发生 change 事件，携带值为', e.detail.value)
        GLOBAL_PAGE.setData({
            isGatherLock:e.detail.value
        })
        wx.setStorageSync('GATHER_OPEN',e.detail.value)
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
    }
});