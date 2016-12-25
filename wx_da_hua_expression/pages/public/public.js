// hotest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');

var Render = require('../../utils/render.js');
var KEY = require('../../utils/storage_key.js');


var APP = getApp()
var GLOBAL_PAGE
Page({
  data: {
    pageName: "public",

    displayLoading: true,
    keyword:"老司机", //搜索关键字
    // emoticon: [],
    hotLabel:["金馆长","我想静静","意外","疼！"],  
    hidden: false,
    //点击弹出菜单
    displayMenu:false,

    //控制菜单上架
    MENU_TYPE:Render.menu.TYPE,
    menuType:"0",
    menuWidth:0,
    menuHeight:0,

    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,

    //页面渲染数据
    emoticon:[],
    category:[],
    tagList:[],

    //touch选择对象
    selectEmoticon:{id:"",name:"",img_url:""}, //预备编辑的图片
    selectCategory:{id:"",name:""},


    indexShow:false,
    shortcutShow:false,
    emoticonShow:false,
    loadShow:true,

     inputShowed: false,
     inputVal: "",
     searchKey:["搞笑","运动","笑屎了","老司机"],
     searchResultShowed:false,
  },

  /** Page:public 基础事件
   * 1、wxml的catchtap全触发eventBase
   * 2、eventDisplay:执行view的显示/隐藏
   * 3、eventListen:根据data-actiondata-action，确定执行的事件
   */
  eventBase:function(e){
    GLOBAL_PAGE.eventListen(e)
    GLOBAL_PAGE.eventDisplay(e.currentTarget.dataset.action)
  },

  /**
   * 触发view的隐藏显示
   */
  eventDisplay:function(action){
    var _display = {
      "onMenu":function(){ View.Switch.On("displayMenu") },
      "btnSearch":function(){ View.Switch.Off("displayMenu") },
      "btnShortcut":function(){ View.Switch.Off("displayMenu") },
      // "btnShare":function(){ View.Switch.Off("displayMenu") },
      // "menuCollect":function(){ View.Switch.Off("displayMenu") },
      "all":function(){ GLOBAL_PAGE.setData({menuType:0}) }, //公共透明遮罩
    }
    if (_display.hasOwnProperty(action))
      _display[action]()
    View.Switch.Work() //触发效果
  },
  eventListen:function(e){

    var _eventDict = {
      "onMenu":GLOBAL_PAGE.onMenu,
      "btnSearch":GLOBAL_PAGE.searchBtn,
      "btnShortcut":GLOBAL_PAGE.searchShortcut,
      "menuShare":GLOBAL_PAGE.menuShare,
      "menuCollect": GLOBAL_PAGE.menuCollect,
    }
    if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
      _eventDict[e.currentTarget.dataset.action](e) 
  },


  // inputBlur:function(e){
  //     var value = e.detail.value
  //     GLOBAL_PAGE.setData({keyword:value})
  // },


  /**
   * 1 根据keyword，搜索
   */
  searchBtn:function(){
    //开启loading
    GLOBAL_PAGE.setData({
      indexShow:false,
      shortcutShow:true,
      emoticonShow:false,
      loadShow:true,
    }) 

    var _keyword = GLOBAL_PAGE.data.keyword
    var url = Api.tagImgQuery() 
    var session = wx.getStorageSync(KEY.session) 
    //获取表情列表
     wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: session,
          tag_name : _keyword,
          // category_id: '1',
          // category_name: _keyword,
        },
        success: function(res) {
          var object = res.data
          GLOBAL_PAGE.renderEmoticon(object.img_list)
        },
        complete:function(){
            GLOBAL_PAGE.setData({
              indexShow:false,
              shortcutShow:true,
              emoticonShow:true,
              loadShow:false,
            }) 
        }
      })
  },

  /** 2 点击Shortcut按钮，触发search搜索，
   * 更新keyword
   */
  searchShortcut:function(e){
    
    GLOBAL_PAGE.setData({
      keyword:e.currentTarget.dataset.keyword,
      inputVal:e.currentTarget.dataset.keyword,
      inputShowed:true,
      searchResultShowed:false,
    })

    if(e.currentTarget.dataset.keyword == "index")
    {
        
        GLOBAL_PAGE.setData({
          indexShow:true,
          shortcutShow:false,
          emoticonShow:false,
          loadShow:false,
        }) 
    }
    else
      GLOBAL_PAGE.searchBtn();

  },



  /** 3 点击表情，悬浮菜单
   */
  onMenu: function(e) {
      GLOBAL_PAGE.setData({
        selectEmoticon:{
          id: e.currentTarget.dataset.id, 
          img_url:e.currentTarget.dataset.img_url,
          category_id:e.currentTarget.dataset.category_id,
          size:e.currentTarget.dataset.size,
          static_url:e.currentTarget.dataset.static_url,
          yun_url:e.currentTarget.dataset.yun_url,
          }
      })

      
      // 显示缩略图
      GLOBAL_PAGE.setData({
          menuType: e.currentTarget.dataset.menu_type
      })
  },

  // 4 图片分享
  menuShare:function(){
    // Menu.Option.Share( GLOBAL_PAGE.data.selectEmoticon )
    var current = GLOBAL_PAGE.data.selectEmoticon.yun_url
    var urls = []
    var e = GLOBAL_PAGE.data.emoticon
    for ( var i = 0;i<e.length;i++)
    {
      if( e[i].menu_type == GLOBAL_PAGE.data.MENU_TYPE.VIDEO)
          continue
      urls.push(e[i].yun_url)
    }
    Render.share(current,urls)
  },

  /**
   * 5 菜单收藏按钮，可以收藏多张
   * 跳转到Page：private时，onShow方法一齐显示
   */
  menuCollect:function(){
      wx.request({
          url: Api.imgAdd() , 
          method:"GET",
          data: {
            session: wx.getStorageSync(KEY.session),
            img_id: GLOBAL_PAGE.data.selectEmoticon.id,
          },
          success: function(res) {
             console.log("collect success:",res.data)
              var object = res.data
              if (object.status == "true")
              {
                  //收藏成功
                  var e = wx.getStorageSync(KEY.emoticon)
                  e.push(object.img)
                  wx.setStorageSync(KEY.emoticon,e)

                  wx.showToast({
                      title: '收藏成功',
                      icon: 'success',
                      duration: 700
                  })
              }
          },
          fail:function(res){
            console.log("collect fail:",res.data)
          }
      })
  },

  onLoad: function () {
    GLOBAL_PAGE = this
    //1 page初始化高宽
    console.log("width:" , APP.globalData.windowWidth)
    console.log("height:" , APP.globalData.windowHeight - 84)
    GLOBAL_PAGE.setData({
      windowWidth:APP.globalData.windowWidth,
      windowHeight:APP.globalData.windowHeight - 84, //搜索框高度42px,短语框高度42px
    })

    //测试初始化表情
    // GLOBAL_PAGE.initTest()
    GLOBAL_PAGE.searchBtn()

    //初始化关键字
    // GLOBAL_PAGE.setData({hotLabel:["默认目录","管理的哈哈","特技","疼"]})
    // GLOBAL_PAGE.setData({hotLabel:["老司机","管理的哈哈","特技","疼","意外","老司机","管理的哈哈","特技","疼","意外"]})
   
    var url =   Api.tagQuery()
    // url = "http://127.0.0.1:8000/tag/query/?session=ds9"
    //获取表情列表
     wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"GET",
        data: {
          session: "ds9"
        },
        success: function(res) {
          var object = res.data
          if(object.status == "true"){
              GLOBAL_PAGE.setData({category:res.data.category_list})
              GLOBAL_PAGE.createTag(res.data.category_list)
              var c_list = []
              for (var i=0;i< res.data.category_list.length;i++)
              {
                  c_list.push(res.data.category_list[i].name)  
              }
              GLOBAL_PAGE.setData({hotLabel:c_list})
   
          }
        },
        complete:function(){
            GLOBAL_PAGE.setData({
              indexShow:false,
              shortcutShow:true,
              emoticonShow:true,
              loadShow:false,
            }) 
        }
      })

    var that = this;
    // 300ms后，隐藏loading
    setTimeout(function() {
        View.Switch.Off("displayLoading")
        View.Switch.Work()
    }, 300)
  },

  createTag:function(category){
      var _cat = category
      var tag = []
      var parent = [],sun_name=[]
      for(var i=0;i<_cat.length;i++)
        if(_cat[i].parent_id ==  null)
          tag.push({
            "parent":_cat[i],
            "sub":[]
          })
          
      for(var i=0;i<_cat.length;i++)
        for(var j=0;j<tag.length;j++)
          if( _cat[i].parent_id == tag[j].parent.category_id)
            tag[j].sub.push(_cat[i])
              //  parent_name.push(_cat[i].name)
      
      console.log(tag)

      GLOBAL_PAGE.setData({
        tagList:tag
      })
  },

  onHide:function(){
    View.Switch.OffAll()
    View.Switch.Work()
  },

  onShow: function() {
    var _view = {
      displayLoading:this.data.displayLoading,
      displayMenu:this.data.displayMenu,
    }
    View.Switch.Init(this,_view)
    View.Switch.Work()
  },

  onReady:function(){
  },

 
  
  renderEmoticon:function(emoticon){
    Render.emoticon(GLOBAL_PAGE,emoticon)
  },

  //图片加载完毕
  bindloadVertical:function(e){
    Render.menu.vertical(GLOBAL_PAGE,e)

  },
  bindloadHorizontal:function(e){    
    Render.menu.horizontal(GLOBAL_PAGE,e)
  },

  onShareAppMessage: function () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
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
      GLOBAL_PAGE.setData({
          inputVal: e.detail.value
      });

      var category = GLOBAL_PAGE.data.category
      var inputVal = e.detail.value
      var searchKey = []
      for (var i=0;i< category.length;i++)
      { 
          console.log(inputVal,category[i].name ,  category[i].name.indexOf(inputVal))
          if(category[i].name.indexOf(inputVal) != -1)
              searchKey.push(category[i].name)  
          // c_list.push(category[i].name)  
      }

      GLOBAL_PAGE.setData({
          searchKey: searchKey
      });
      


      // var input='这是一大段文本';
      // var keys=['这是','这里是','文本','一'];
      
      // var prepareKeys=function(){
      //   if(!prepareKeys.$map){
      //     var map={};
      //     var maxLength=0;
      //     for(var i=0;i<keys.length;i++){
      //       map[keys[i]]=1;
      //       maxLength=Math.max(keys[i].length,maxLength);
      //     }
      //     prepareKeys.$map={
      //       map:map,
      //       length:maxLength
      //       }
      //     }
      //   return prepareKeys.$map;
      // }
      
      // var colorKeyword=function(str){
      // var info=prepareKeys();
      // var output=[];
      // while(str){
      //   var sub=str.substring(0,info.length);
      //   str=str.substring(info.length);
      //   while(!info.map[sub]&&sub){
      //     str=sub.charAt(sub.length-1)+str;
      //     sub=sub.slice(0,-1);
      //     console.log(sub);
      //   }
      //   console.log('color',sub);
      //     if(sub){
      //       output.push('#',sub,'#');
      //     }else{
      //       output.push(str.charAt(0));
      //       str=str.substring(1);
      //     }
      //   }
      //   return output.join('');
      // }
      // colorKeyword(input);

  },

    // 输入框聚焦
  inpuFocus:function(e){
      GLOBAL_PAGE.setData({
        searchResultShowed:true,
    })
  },

  inpuBlur:function(e){
      GLOBAL_PAGE.setData({
        searchResultShowed:false,
    })
  },

  
})
