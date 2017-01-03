
// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var KEY = require('../../utils/storage_key.js');

var t_id = 0
var GLOBAL_PAGE
var APP = getApp()
Page({
  data: {
    myCategory:["t1","t2"],
    tempCategory:["t1","t2"],
    hasImg:["true","false"],

    //屏幕高宽
    windowWidth:0,
    windowHeight:1000,

    category:[],
    tCategory:[],
    // t_index:0,
    
    isAdd:false, //是否增加新目录
    addCategoryInput:"", //新目录名字输入
  },

  //focus离开input后，更新临时缓存
  inputBlur:function(e){
      GLOBAL_PAGE.setData({addCategoryInput:e.detail.value })
  },

  // 1 增加目录
  addCategory:function(){

    if(GLOBAL_PAGE.data.category.length <= 15)
        GLOBAL_PAGE.setData({
            isAdd:true,
        })
    else
        wx.showModal({
            title: '无法增加目录',
            content: '暂时支持最多15个目录',
            showCancel:false,
        })
  },

  // 2 确认增加目录
  addCategoryOK:function(){
        if (GLOBAL_PAGE.data.addCategoryInput == "")
        {
            wx.showModal({
                title: '请输入目录名称',
                showCancel:false,
            })
            return
        }

        GLOBAL_PAGE.setData({
            isAdd:false,
        })

        wx.request({
            url: Api.categoryAdd(),
            method:"GET",
            data: {
                session: wx.getStorageSync(KEY.session) ,
                category_name:GLOBAL_PAGE.data.addCategoryInput,
            },
            success: function(res) {
                var object = res.data
                if(object.status == "true")
                {
                    var c = wx.getStorageSync(KEY.category)
                    c.push(object.category)
                    wx.setStorageSync(
                        KEY.category,
                        c
                    )
                    GLOBAL_PAGE.renderCategory()
                }
                 
            }
        })
  },
  
  // 3 取消增加目录 
  addCategoryCancel:function(){
      GLOBAL_PAGE.setData({
          isAdd:false,
      })
  },

  // 4 目录修改
//   fixCategory:function(){
//       var _my = GLOBAL_PAGE.data.myCategory
//       var _temp = GLOBAL_PAGE.data.tempCategory
//       if( _my.toString() == _temp.toString())
//       {
//         wx.showToast({
//             title: '未做任何修改',
//             icon: 'loading',
//             duration: 500,
//             success:function(){}
//         })
//       }
//       else
//       {
//           //TodoTodo 上传修改书局
//           //本地Storage保存

          
//         wx.showToast({
//             title: '修改成功',
//             icon: 'success',
//             duration: 500,
//             success:function(){}
//         })
//       }
//   },
  // 5 目录删除
  deleteCategory:function(e){
        //默认目录不能删除
        if (e.currentTarget.dataset.is_default == "1" || e.currentTarget.dataset.is_default == 1)
        {
             wx.showModal({
                title: '无法删除目录',
                content: '默认目录不能删除',
                showCancel:false,
            })
            return
        }

       //目录带有 
        if (e.currentTarget.dataset.has_img == "true" || e.currentTarget.dataset.has_img == true)
        {
            wx.showModal({
                title: '无法删除目录',
                content: '需移除该目录下的表情',
                showCancel:false,
            })
            return
        }
     
        wx.request({
            url: Api.categoryDelete(), //仅为示例，并非真实的接口地址
            method:"GET",
            data: {
                session : wx.getStorageSync(KEY.session),
                category_id : e.currentTarget.dataset.category_id
            },
            success: function(res) {
                var object = res.data
                wx.setStorageSync(
                    KEY.category,
                    object.category_list
                )
                GLOBAL_PAGE.renderCategory()
                wx.showToast({
                    title: '目录删除成功',
                    icon: 'success',
                    duration: 700
                })
            }
        })
    
  },
  
  onLoad: function (param) {
    GLOBAL_PAGE = this
    console.log(param["category"])
  

    //数据初始化 目录
    var url = Api.categoryQuery() 
    wx.request({
        url: Api.categoryQuery(), //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
            session:  wx.getStorageSync(KEY.session),
        },
        success: function(res) {
            var object = res.data
            wx.setStorageSync(
                KEY.category,
                object.category_list
            )
            GLOBAL_PAGE.renderCategory()
        }
    })
    
    
  },

  renderCategory:function(){
    GLOBAL_PAGE.setData({category:wx.getStorageSync(KEY.category)})
  },

})