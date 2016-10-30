
// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var global_page
Page({
  data: {
    myCategory:[],
  },

  addCategory:function(){
      var _list = global_page.data.myCategory
      _list.push( {name:"" , Elemnt:0})
      global_page.setData({
          myCategory:_list
      })
  },

  fixCategory:function(){
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 500,
        success:function(){
            setTimeout(function() {
                wx.navigateBack()
            }, 600)
            
        }
    })
    
  },

  deleteCategory:function(e){
    var _index = e.currentTarget.dataset.index
    var _list = global_page.data.myCategory
    //目录含有元素，不能删除
    if(_list[_index]["Elemnt"] != 0)
    {
        wx.showToast({
            title: '请先移除该分类的表情图',
            icon: 'loading',
            duration: 800
        })
        return
    }
    else
    {
        _list.splice(_index,1)
        global_page.setData({
            myCategory:_list
        })
        wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 500
        })
    }


    
  },
  onReady:function(){
    var _category = [
        {name:"目录1" , Elemnt:21},
        {name:"目录dsad2" , Elemnt:21},
        {name:"傻逼目录3" , Elemnt:32},
    ]

    this.setData({
        myCategory:_category
    })
  },
  
  onLoad: function (param) {
    global_page = this

      
    
  }

})