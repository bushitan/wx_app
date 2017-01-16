// manage.js

var APP = getApp()
var GLOBAL_PAGE
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');

Page({
  data: {
    emoticon:[{
      static_url:"http://image.12xiong.top/9_20161118171253.jpg",
      img_id:1,
      is_select:false,
      }],
    tag:[
      {parent:"运动",parent_id:1,sub:["老司机","玩"]},
      {parent:"搞笑",parent_id:1,sub:["哈哈","玩1"]},
    ],

    selectEmoticon:{img_id:1,img_url:"http://7xsark.com1.z0.glb.clouddn.com/12_20161205115232.gif"},


    preEmoticon:[],
  },

  choiceTag:function(e){
    var tag_id = parseInt(e.currentTarget.dataset.tag_id)
    // var img_id = GLOBAL_PAGE.data.selectEmoticon.img_id



    var img_id_list = ""
    var emoticon = GLOBAL_PAGE.data.emoticon
    for(var i=0;i<emoticon.length;i++)
          if(emoticon[i].is_select == true )
              img_id_list += emoticon[i].img_id + ","
    img_id_list = img_id_list.substring(0,img_id_list.length-1) //删除最后的逗号,

    wx.request({
        url: API.tagImgAdd() , //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: wx.getStorageSync(KEY.session),
          tag_id:tag_id,
          img_id_list:img_id_list,
        },
        success: function(res) {
          var object = res.data
    
          wx.showToast({
              title: '',
              icon: 'success',
              duration: 500
          })
        }
    })

  },
  selectAll:function(e){
      var emoticon = GLOBAL_PAGE.data.emoticon
      for(var i=0;i<emoticon.length;i++)
            emoticon[i].is_select = !emoticon[i].is_select
      GLOBAL_PAGE.setData({
        emoticon:emoticon,
      })
  },
  choiceEmoticon:function(e){
    
    // var preEmoticon =  GLOBAL_PAGE.data.preEmoticon
    var emoticon = GLOBAL_PAGE.data.emoticon
    for(var i=0;i<emoticon.length;i++)
      if(emoticon[i].img_id == e.currentTarget.dataset.img_id)
      {
          emoticon[i].is_select = !emoticon[i].is_select
          // preEmoticon.push(emoticon[i])
      }
          

    // console.log(preEmoticon)
     GLOBAL_PAGE.setData({
       emoticon:emoticon,
      //  preEmoticon:preEmoticon,
      selectEmoticon:{
          img_id: parseInt(e.currentTarget.dataset.img_id), 
          img_url:e.currentTarget.dataset.static_url,
      }
    })
    console.log(GLOBAL_PAGE.data.selectEmoticon)
  },

  renderEmoticon:function(img_list){
      var e_list = [],static_url
      for (var i=0;i<img_list.length;i++){
          if (img_list[i].size == 4)
            static_url = img_list[i].yun_url  + "?vframe/jpg/offset/0/w/120/h/90"
          else 
            static_url = img_list[i].yun_url  + "?imageMogr2/thumbnail/96x96/format/jpg"
          e_list.push({
            img_id: img_list[i].img_id,
            static_url: static_url,
            is_select:false,
          })
      }
      GLOBAL_PAGE.setData({emoticon:e_list})
  },

  renderTag:function(category_list){
    var tag = []

    for ( var i=0;i<category_list.length;i++)
      if (category_list[i].parent_id == null){
          tag.push({
              name:category_list[i].name,
              id:category_list[i].category_id,
              sub:[]
          })
      }

    for ( var i=0;i<category_list.length;i++)
      if (category_list[i].parent_id != null)
          for ( var j=0;j<tag.length;j++)
          {
              if(category_list[i].parent_id == tag[j].id)
                tag[j].sub.push({
                  name:category_list[i].name,
                  id:category_list[i].category_id
                })
          }
    
    GLOBAL_PAGE.setData({tag:tag})
  },

  onLoad: function () {
    // this.fetchData();
    GLOBAL_PAGE = this
    // this.fetchExpress();
    
    //获取表情列表
     wx.request({
        url: API.imgQuery() , //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: wx.getStorageSync(KEY.session) ,
          category_id: '2', //全部 null
          category_name :'今日斗图',
        },
        success: function(res) {
          var object = res.data
          // wx.setStorageSync(
          //     Key.emoticon,
          //     object.img_list
          // )
          
          GLOBAL_PAGE.renderEmoticon(object.img_list)
        }
      })

      //获取tage
      wx.request({
        url: API.tagQuery(), //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: wx.getStorageSync(KEY.session) ,
        },
        success: function(res) {
          var object = res.data
           GLOBAL_PAGE.renderTag(object.category_list)
          // wx.setStorageSync(
          //     Key.emoticon,
          //     object.img_list
          // )
          
          // GLOBAL_PAGE.renderEmoticon(object.img_list)
        }
      })

      // //数据初始化 目录
      // url = Api.categoryQuery() 
      // wx.request({
      //   url: url, //仅为示例，并非真实的接口地址
      //   method:"GET",
      //   data: {
      //     session: session,
      //   },
      //   success: function(res) {
      //     var object = res.data
      //     if (object.status == "true")
      //     {
      //         // wx.setStorageSync(
      //         //     KEY.category,
      //         //     object.category_list
      //         // )
      //     GLOBAL_PAGE.renderCategory()
      //     }
      //     else
      //       wx.showModal({
      //           title: '网络连接失败，请重试',
      //           showCancel:false,
      //       })
      //   },
      //   fail:function(res){
      //       wx.showModal({
      //           title: '网络连接失败，请重试',
      //           showCancel:false,
      //       })
      //   },
      // })
  }
})