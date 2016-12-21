Page({
    data: {
        inputShowed: false,
        inputVal: "",
        grids: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,0, 1, 2, 3, 4, 5, 6, 7, 8,9,10],
        array: ['1s', '2s', '3s', '4s', '5s', '6s'],
        index: 0,

    },
    bindPickerChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
        index: e.detail.value
        })
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    }
});