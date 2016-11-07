
// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var global_page
Page({
  data: {
    myCategory:["t1","t2"],
    tempCategory:["t1","t2"],
    hasImg:["true","false"],
  },

  //focus离开input后，更新临时缓存
  inputBlur:function(e){
      var _index = e.currentTarget.dataset.index
      var _value = e.detail.value
      var _tempList = global_page.data.myCategory
      _tempList[_index] = _value
      global_page.setData({myCategory:_tempList})
  },
  addCategory:function(){
      var _list = global_page.data.myCategory
      var _hasImg = global_page.data.hasImg
      _list.push("")
      _hasImg.push("false")
      global_page.setData({
          myCategory:_list,
          hasImg:_hasImg,
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
    var _index = e.currentTarget.dataset.index
    var _hasImg = global_page.data.hasImg
    var _isTrue = _hasImg[_index]
    if (_isTrue == true || _isTrue == "true"){
        wx.showToast({
            title: '请先移除该分类的表情图',
            icon: 'loading',
            duration: 800
        })
        return
    }
    else
    {
        var _temp = global_page.data.myCategory
        var _hasImg = global_page.data.hasImg

        _temp.splice(_index,1)
        _hasImg.splice(_index,1)
        global_page.setData({
            myCategory:_temp,
            hasImg:_hasImg,
        })
    }
  },
  onReady:function(){
    // var _category = [
    //     {name:"目录1" , Elemnt:21},
    //     {name:"目录dsad2" , Elemnt:21},
    //     {name:"傻逼目录3" , Elemnt:32},
    // ]

    // this.setData({
    //     myCategory:_category
    // })
  },
  
  onLoad: function (param) {
    global_page = this
    console.log(param["category"])
    var _c = param["category"].split(",");
    var _h = param["hasimg"].split(",");
    this.setData({
        myCategory:_c,
        tempCategory:_c,
        hasImg:_h
    })


    // for(var i = 0 ; i<)
    // var _category = [
    //     {name:"目录1" , Elemnt:21},
    //     {name:"目录dsad2" , Elemnt:21},
    //     {name:"傻逼目录3" , Elemnt:32},
    // ]

    
    
  }

})