
// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var t_id = 0
var global_page
var app = getApp()
Page({
  data: {
    myCategory:["t1","t2"],
    tempCategory:["t1","t2"],
    hasImg:["true","false"],

    category:[],
    tCategory:[],
    // t_index:0,

    isAdd:false, //是否增加新目录
    addCategoryInput:"", //新目录名字输入
  },

  //focus离开input后，更新临时缓存
  inputBlur:function(e){

      global_page.setData({addCategoryInput:e.detail.value })
  },
  addCategory:function(){
      global_page.setData({
          isAdd:true,
      })
  },

  addCategoryOK:function(){
      if (global_page.data.addCategoryInput == "")
      {
         wx.showToast({
            title: '请输入目录名称',
            icon: 'loading',
            duration: 800
        })
        return
      }

        global_page.setData({
            isAdd:false,
        })

        var url = Api.categoryAdd() 
        var formData = new FormData();
        formData.append("category_name",global_page.data.addCategoryInput);
        formData.append("uid",app.globalData.uid); //当前用户uid
        fetch(url , {
            method: 'POST',
            headers: {},
            body: formData,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((object) => {
            console.log(object);
            //将新的目录更新至storage
            wx.setStorageSync(
                "category",
                object.category_list
            )
            this.setData({
                category:wx.getStorageSync('category'),  
            })
         
        }).catch((error) => {
            console.error(error);
        });

  },

  addCategoryCancel:function(){
      global_page.setData({
          isAdd:false,
      })
  },


  fixCategory:function(){


      var _my = global_page.data.myCategory
      var _temp = global_page.data.tempCategory

      if( _my.toString() == _temp.toString())
      {
        wx.showToast({
            title: '未做任何修改',
            icon: 'loading',
            duration: 500,
            success:function(){}
        })
      }
      else
      {
          //TodoTodo 上传修改书局
          //本地Storage保存

          
        wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 500,
            success:function(){}
        })
      }
  },

  deleteCategory:function(e){
      if (e.currentTarget.dataset.has_img == "true" || e.currentTarget.dataset.has_img == true)
      {
        wx.showToast({
            title: '请先移除该分类的表情图',
            icon: 'loading',
            duration: 800
        })
        return
      }
          

    var url = Api.categoryDelete() 
    var formData = new FormData();
    formData.append("uid",app.globalData.uid); //当前用户uid
    formData.append("category_id",e.currentTarget.dataset.category_id);
    fetch(url , {
        method: 'POST',
        headers: {},
        body: formData,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    }).then((object) => {
        console.log(object);
        if(object.status == "true")
        {
            //将新的目录更新至storage
            wx.setStorageSync(
                "category",
                object.category_list
            )
            this.setData({
                category:wx.getStorageSync('category'),  
            })
        }
        
        
    }).catch((error) => {
        console.error(error);
    });


    // var _index = e.currentTarget.dataset.index
    // var _hasImg = global_page.data.hasImg
    // var _isTrue = _hasImg[_index]
    // if (_isTrue == true || _isTrue == "true"){
    //     wx.showToast({
    //         title: '请先移除该分类的表情图',
    //         icon: 'loading',
    //         duration: 800
    //     })
    //     return
    // }
    // else
    // {
    //     var _temp = global_page.data.myCategory
    //     var _hasImg = global_page.data.hasImg

    //     _temp.splice(_index,1)
    //     _hasImg.splice(_index,1)
    //     global_page.setData({
    //         myCategory:_temp,
    //         hasImg:_hasImg,
    //     })
    // }
  },
  onReady:function(){

  },
  
  onLoad: function (param) {
    global_page = this
    console.log(param["category"])

    
    
    this.setData({
        category:wx.getStorageSync('category'),  
        // tCategory:wx.getStorageSync('category') , 
    })



    // var _c = param["category"].split(",");
    // var _h = param["hasimg"].split(",");
    // this.setData({
    //     myCategory:_c,
    //     tempCategory:_c,
    //     hasImg:_h
    // })


    // for(var i = 0 ; i<)
    // var _category = [
    //     {name:"目录1" , Elemnt:21},
    //     {name:"目录dsad2" , Elemnt:21},
    //     {name:"傻逼目录3" , Elemnt:32},
    // ]

  }

})