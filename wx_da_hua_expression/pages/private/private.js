// latest.js
var Api = require('../../utils/api.js');
var View = require('../../utils/view.js');
var Menu = require('../../utils/menu.js');
var Render = require('../../utils/render.js');

var app = getApp()
var global_page
var appInstance
Page({
  data: {
    title: '最新话题',
    latest: [],
    hidden: false,
    
    displayUpload:false,
    displayCategory:false,
    displayMenu:false,
    displayMask:false,
    displayJoin:false,
    displayResize:false,
 
    // categoryTitle:"全部",
    // category:[],
    // categorySelectName:"全部",

/***********************分割线*************************** */    

    //控制菜单上架
    classMenu:"m-down",  //m-up  m-down

    // 手机设备信息，均已rpx为标准
    windowWidth:0,
    windowHeight:0,

    //页面渲染数据
    emoticon:[],
    category:[],
    category_default:{},

    //touch选择对象
    selectEmoticon:{id:"",name:"",img_url:""}, //预备编辑的图片
    selectCategory:{id:"",name:""},

  },

   //选择目录
  selectCategory:function(e){
    //改变目录
    global_page.setData({
      selectCategory:{id: e.currentTarget.dataset.select_id},
    })

    //根据emoticone，更新表情
    var e_list = wx.getStorageSync("emoticon")
    var new_list = []
    for (var i = 0; i<e_list.length;i++)
      if(e_list[i].category_id == global_page.data.selectCategory.id)
        new_list.push(e_list[i])
    
    Render.emoticon(this,new_list)
  },




  /** No.1
   * Page:private 回调函数
   * 该页面唯一的回调函数
   * imgUrl:按时间先手顺序加入， 逆转时间显示
   * isDelete:确认删除图片
   */
  callBack:function(imgUrl,isDelete){
    if(imgUrl) 
      global_page.emoticonUpdate(imgUrl)

    if(isDelete)
      global_page.emoticonDelete(global_page.data.selectEmoticon)
  },

  /** No.2
   * Page:private 基础事件
   * 1、wxml的catchtap全触发eventBase
   * 2、eventDisplay:执行view的显示/隐藏
   * 3、eventListen:根据data-actiondata-action，确定执行的事件
   */
  eventBase:function(e){
    global_page.eventListen(e)
    global_page.eventDisplay(e.currentTarget.dataset.action)
  },


  /**No2.1
   * 触发view的隐藏显示
   */
  eventDisplay:function(action){
    var _display = {
      //目录菜单
      "btnCategory":function(){View.Switch.OffAllExcept("displayCategory","displayMask")}, //btn目录，显示目录、遮罩
      "changeCategory":function(){View.Switch.Off("displayCategory","displayMask")},//选择目录，关闭目录、遮罩
      "navigateToCategory":function(){View.Switch.Off("displayCategory","displayMask")},//设置目录，关闭目录、遮罩
      //上传菜单
      "btnUpload":function(){ View.Switch.OffAllExcept("displayUpload","displayMask") },//btn上传，显示上传、遮罩
      "navigateToPainter":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传图片，关闭上传、遮罩
      "uploadImage":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传图片，关闭上传、遮罩
      "uploadVideo":function(){ View.Switch.Off("displayUpload","displayMask") },//btn上传视频，关闭上传、遮罩
      // 表情功能菜单
      "onMenu":function(){ View.Switch.On("displayMenu") },//btn打开菜单
      "menuJoinAdd":function(){ View.Switch.OffAllExcept("displayJoin") },
      // "menuJoinOK":function(){ View.Switch.Off("displayMenu") },
      "menuResize":function(){ View.Switch.OffAllExcept("displayResize")},
      // "menuResizeShare":function(){ View.Switch.Off("displayMenu") },
      // "menuResizeAdd":function(){ View.Switch.Off("displayMenu") },
      // "menuShare":function(){ View.Switch.Off("displayMenu") },
      "navigateToEditor":function(){ View.Switch.Off("displayMenu") },
      // "menuDelete":function(){ View.Switch.OffAll() },
      "menuMoveCategory":function(){ View.Switch.OffAll() },
      //基本view:遮罩、All
      "mask":function(){View.Switch.OffAll()}, //公共透明遮罩
      "all":function(){View.Switch.Off("displayMenu")}, //公共透明遮罩
    }
    if (_display.hasOwnProperty(action))
      _display[action]()
    View.Switch.Work() //触发效果
  },
  eventListen:function(e){

    var _eventDict = {
      "btnCategory":global_page.categoryBtn,
      "changeCategory":global_page.categoryChange,
      "navigateToCategory":global_page.navigateToCategory,

      "btnUpload":global_page.uploadBtn,
      "navigateToPainter": global_page.navigateToPainter,
      "uploadImage": global_page.uploadImage,
      "uploadVideo": global_page.uploadVideo,

      "menuJoinOK": global_page.menuJoinOK,
      "menuResizeShare": global_page.menuResizeShare,
      "menuResizeAdd": global_page.menuResizeAdd,
      "onMenu": global_page.onMenu,
      "menuShare": global_page.menuShare,
      "navigateToEditor": global_page.navigateToEditor,
      "menuJoinAdd": global_page.menuJoinAdd,
      "menuDelete": global_page.menuDelete,
      "menuMoveCategory": global_page.menuMoveCategory,
      "menuResize": global_page.menuResize,


      // 新的裁剪
      "menuResizeV2": global_page.menuResizeV2,
      "btnUploadV2":global_page.btnUploadV2,
      "selectCategory":global_page.selectCategory,
      "refesh":global_page.refesh,
    }

    if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
      _eventDict[e.currentTarget.dataset.action](e) 
  },


/**Todo
     * 1、传入该分类的总张数
     * 2、设置已获取张渚
     * 3、设置准备获取数量
     * 4、当准备获取量为0，提示"图片加载完毕"
     *  */
  refesh:function(){
    console.log("refesh")
  },

   //新开发 目录最后点击“+”开关
  btnUploadV2:function() {
     wx.showActionSheet({
      itemList: ['图片(GIF需要原图)', '小视频'],
      success: function(res) {
        if (!res.cancel) {
          // console.log(res.tapIndex)
          //Todo 上传
          var _new_img = global_page.data.selectEmoticon
          global_page.emoticonUpdate(_new_img)
        }
      }
    })

  },

  //上传图片
  uploadImage:function() {
    Menu.Option.ChooseImage(global_page.callBack)
  },
  
  //选择视频
  uploadVideo : function() {
    Menu.Option.ChooseVideo(global_page.callBack)
  },
 
   //点击表情，打开第一级menu
  onMenu: function(e) {
    //准备当前预备编辑的图片地址
    global_page.setData({
      selectEmoticon:{id: e.currentTarget.dataset.id, img_url:e.currentTarget.dataset.img_url}
    })

    if (e.currentTarget.offsetTop < 200)
       global_page.setData({classMenu:"m-down"})
    else
       global_page.setData({classMenu:"m-up"})

  },
  // 分享
  menuShare:function(){
    Menu.Option.Share( global_page.data.selectEmoticon )
  },

  // 裁剪
  menuResizeV2:function(){
    wx.showActionSheet({
      itemList: ['大图(170x170)', '中图(128x128)', '小图(96x96)', '炒鸡小(48x48)'],
      success: function(res) {
        if (!res.cancel) {
          // console.log(res.tapIndex)
          //Todo 上传
          var _new_img = global_page.data.selectEmoticon
          global_page.emoticonUpdate(_new_img)
        }
      }
    })
  },

  // 表情删除
  menuDelete:function(){
    Menu.Option.Delete(global_page.callBack)
    //删除后，menu框隐藏
  },

  // 表情移动分组
  menuMoveCategory:function(){
    wx.showActionSheet({
      itemList: global_page.data.category,
      success: function(res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          
          var url = Api.categoryMove() 
          var session = wx.getStorageSync('session') 
          //获取表情列表
          wx.request({
              url: url, //仅为示例，并非真实的接口地址
              method:"POST",
              data: Api.json2Form({
                session: session,
                img_id: global_page.data.selectEmoticon.id,
                category_id: 'null',
              }),
              header: {  
                "Content-Type": "application/x-www-form-urlencoded"  
              },
              success: function(res) {
                var object = res.data
                wx.setStorageSync(
                    "emoticon",
                    object.img_list
                )
                Render.emoticon(global_page,object.img_list)
              }
            })
          console.log("storyge" );


        }
      }
    })
  },

  onHide:function(){
    View.Switch.OffAll()
    View.Switch.Work()
  },

  Render:function(){
     //2 初始化本地表情表
     Render.emoticon(this,wx.getStorageSync("emoticon"))
    //3 初始化目录
     Render.category(this,wx.getStorageSync("category"))
  },

  onShow: function() {
    //菜单显示框
    var _view = {
      displayMenu:false,
    }
    View.Switch.Init(this,_view)
    View.Switch.Work()

    //渲染表情和目录
    global_page.Render()
   
     //4 初始化选择目录
  },

  
  /**
   * 加载完毕，更新图片
   */
  onReady:function(){
    // Menu.Option.GetPictureMy(global_page.callBack)  //临时删除
    
  },


  /**
   *  页面加载
   */
  onLoad: function (param) {    
    global_page = this
    //1 page初始化高宽
    global_page.setData({
      windowWidth:app.globalData.windowWidth,
      windowHeight:app.globalData.windowHeight,
    })
    
    //2 user loginlogin
    wx.login
    ({
        success: function (res) 
        {
          var _session = wx.getStorageSync('session') 
          if (! _session  ) //检查session,不存在，为false
            _session = "false"
          var url = Api.userLogin()
          wx.request
          ({  
            url: url, 
            method:"POST",
            data:Api.json2Form({
              js_code:res.code,
              session:_session,
            }),
            header:{ "Content-Type": "application/x-www-form-urlencoded" },
            success: function(res)
            {
              if (res.data.status == "true") //登陆成功
              {
                wx.setStorageSync('session', res.data.session)
                //Todo 初始化页面、目录
                global_page.onInit()
              }
                
              else
                wx.showToast({
                  title: '登陆失败',
                  icon: 'loading',
                  duration: 1000
                })              
            },
            fail:function(res) { 
             wx.showToast({
                  title: '网络连接失败',
                  icon: 'loading',
                  duration: 1000
                })    
            },
            complete:function(res) { 
              console.log("private complete")
              console.log(res)
            },
          })
        }
    });

    var that = this;
    // // 300ms后，隐藏loading
    setTimeout(function() {
          that.setData({
            hidden: true
          })
    }, 300)
  },

  //Page：private  初始化页面的钩子
  onInit:function( ){
    //数据初始化 图片
    var that = this;
    var url = Api.imgQuery() 

    var session = wx.getStorageSync('session') 
    if (! session  ) //检查session,不存在，为false
      session = "false"

    //获取表情列表
     wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"POST",
        data: Api.json2Form({
          session: session,
          category_id: 'null',
        }),
        header: {  
          "Content-Type": "application/x-www-form-urlencoded"  
        },
        success: function(res) {
          var object = res.data
          wx.setStorageSync(
              "emoticon",
              object.img_list
          )
          Render.emoticon(global_page,object.img_list)
        }
      })
    console.log("storyge" );
    
    

     //数据初始化 目录
      url = Api.categoryQuery() 
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        method:"POST",
        data: Api.json2Form({
          session: session,
        }),
        header: {  
          "Content-Type": "application/x-www-form-urlencoded"  
        },
        success: function(res) {
          var object = res.data
          
          //设置"全部"目录
          for (var i=0 ; i< object.category_list.length ; i++)
            if(object.category_list[i].is_default == 1)
              global_page.setData({
                category_default:object.category_list[i],
                selectCategoryId:object.category_list[i].category_id,
              })
          
          if (object.category_list.length == 1 ) //1个默认目录，不显示
          {
            global_page.setData({category:[]})
          
          }
          else  //多个目录，默认目录不显示
          { 
            var _c = []
            for (var i=0 ; i< object.category_list.length ; i++)
              if(object.category_list[i].is_default == 0)
                _c.push(object.category_list[i])
            global_page.setData({category:_c})
          }
          
          wx.setStorageSync(
              "category",
              object.category_list
          )
        }
      })
    
  },

   //导航：水印页面
  navigateToEditor: function(e) {
    var url = '../watermark/watermark?imgurl=' + global_page.data.selectEmoticon;
    wx.navigateTo({
      url: url
    })
  },

  //导航：gif拼接页面
  navigateToJoin: function(e) {
    var url = '../join/join?imgurl=' + global_page.data.selectEmoticon;
    wx.navigateTo({
      url: url
    })
  },
  
  //导航：目录设置页面
  //param 当前目录
  navigateToCategory: function(e) {
    var url = '../category/category'
    wx.navigateTo({
      url: url
    })
  },

  //导航：目录设置页面
  navigateToPainter: function(e) {
    var url = '../painter/painter'
    wx.navigateTo({
      url: url
    })
  },
})





