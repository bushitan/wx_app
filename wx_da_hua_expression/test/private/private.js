Page({
    data: {
        inputShowed: false,
        inputVal: "",
        grids: [0, 1, 2, 3, 4, 5, 6, 7, 8,9,10,0, 1, 2, 3, 4, 5, 6, 7, 8,9,10]
  
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