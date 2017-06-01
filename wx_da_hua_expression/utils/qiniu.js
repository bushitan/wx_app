
//上传图片
function uploadQiniuImage () {
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: function (res) {
            GLOBAL_PAGE.uploadPrepare(1, res.tempFilePaths)
            var tempFilePath = res.tempFilePaths[0] //图片 
            console.log(res.tempFilePaths)
            GLOBAL_PAGE.uploadFile(tempFilePath)
        },
        fail: function (res) {
            console.log(res)
        }
    })
}
function uploadFile (file_path) {
    var _type = file_path.split(".").pop()
    console.log(file_path)

    //全选的时候catId == null，选择默认目录的id存放
    //不改变当前selectCat的id，上传后就不会跳转
    var selectCategory = GLOBAL_PAGE.data.selectCategory
    var _tempCatId = null
    if (selectCategory.category_id == null) {
        var category = GLOBAL_PAGE.data.category
        for (var i = 0; i < category.length; i++)
            if (category[i].is_default == 1) {
                _tempCatId = category[i].category_id
                break
            }
    }
    else
        var _tempCatId = selectCategory.category_id

    wx.request({
        url: Api.uploadToken(),
        data: {
            'session': wx.getStorageSync(Key.session),
            "type": _type,
            "category_id": _tempCatId,
        },
        success: function (res) {
            var data = res.data
            console.log(data)
            if (data.status == "true") {
                wx.uploadFile({
                    url: 'https://up.qbox.me',
                    // filePath: tempFilePaths[0],//图片
                    filePath: file_path,//小视频
                    name: 'file',
                    formData: {
                        'key': data.key,
                        'token': data.token,
                    },
                    success: function (res) {
                        console.log("上传成功")
                        var data = JSON.parse(res.data);
                        console.log(data)
                        if (data.status == "true") {
                            var e = wx.getStorageSync(Key.emoticon)
                            e.splice(0, 0, data.img); //从第一位插入
                            // e.push(data.img)
                            wx.setStorageSync(Key.emoticon, e)
                            GLOBAL_PAGE.renderEmoticon()

                            GLOBAL_PAGE.uploadCompelte()//上传成功，继续上传
                        }
                        else {
                            wx.showModal({
                                title: '网络连接失败，请重试',
                                showCancel: false,
                            })
                            GLOBAL_PAGE.setData({ isUpload: false })
                        }
                    },
                    fail(error) {
                        console.log(error)
                        wx.showModal({
                            title: '网络连接失败，请重试',
                            showCancel: false,
                        })
                        GLOBAL_PAGE.setData({ isUpload: false })
                    },
                    complete(res) {
                        console.log(res)

                    }
                })
            }
            else {
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel: false,
                })
                GLOBAL_PAGE.setData({ isUpload: false })
            }
        },
        fail: function (res) {
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel: false,
            })
            GLOBAL_PAGE.setData({ isUpload: false })
        },
        complete: function (res) {
            // GLOBAL_PAGE.setData({isUpload:false})
        },
    })
}

module.exports = {
    UPLOAD: uploadQiniuImage,
}
