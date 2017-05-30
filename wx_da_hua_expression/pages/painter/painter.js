/** painter.js */  
var API = require('../../utils/api.js');
var KEY = require('../../utils/storage_key.js');
// var View = require('../../utils/view.js');
// var Menu = require('../../utils/menu.js');
var GLOBAL_PAGE
var global_page
// var context
var context_lancet
var context_1
var point_lancet = []

var APP = getApp()
var PAINTER_STEP_LOAD = 0;
var PAINTER_STEP_FREE = 1; //未参与，创建新的
var PAINTER_STEP_BUSY = 2; //正在参与，down上step的
var PAINTER_STEP_SHARE = 3; //待分享

var MODE_PENCIL = 1;
var MODE_ERASER = 2;
Page({
    data: {
        //调色盘列表
        colors: ['#666666','#000000', '#FF0000', '#FFA500', 
        '#FFFF00', '#008000', '#0000FF', '#ffffff',],
        //选中的颜色
        paintColor: '#000000',
        // sizes:[1,5,10,15,20,30,40],
        sizes:[1,2,3,4,6,8,10,15,20,30,40],
        paintSize:4,
        
        eraserSizes:[1,2,3,4,6,8,10,15,20,30,40],
        eraserColor: '#ffffff', //切换橡皮擦，临时保存颜色
        eraserSize:6, //切换橡皮擦，临时保存大小

        context:"",

        mode:MODE_PENCIL, //  1 pencil 2 eraser

        displayLancet:true,
        tempImage:null,
        isUpload:null,

        themeName:"一起画表情",
        // imgUpload:"", 
        // imgUpload:"", 
        // imgUpload:"http://image.12xiong.top/1_20170114161832.jpg", 
        // imgUpload:"http://image.12xiong.top/1_20170114161832.png", 


        uploadStatus: 0 , // 0 未上传上传  1 上传成功

        themeId:null,
        stepId:null,
        stepNumber:null,
        
        imgUrl:"", //下载的图片

        joinStatus: 1 , // 用户参加活动状态 1 未参与 ， 2正在参与

        canvasWidth:320,
        canvasHeight:400,
        canvasLeft:0,

        //工具栏选择详情
        colorShow:false,
        pencilShow:false,//false true
        eraserShow:false,//false true


        //加载图片
        paintImgCache:"",

        paintImgSelectUrl:"",//
        paintImgSelectWidth:"",//
        paintImgSelectHeight:"",//
        ratioWH:"",//
        isAddPaintImg:false, //是否正在增加图片，是是，隐藏canvas

        selectOject:{
            dx:0,
            dy:0,
            left:50,
            top:50,
            input_offset_x:0,
            input_offset_y:0,
        },
        touchStart:{x:1,y:2}, //手指touch开始的位置 

        resizeStartPoint:{x:1,y:2}, //手指touch开始的位置 
        resizeMovePoint:{x:1,y:2}, //手指touch开始的位置 
        tempWidth:0,
        tempHeight:0,

        isDraw:false, //是否画过，没画过无法保存

        lockSnatch:false,
        lockComplete:false,


        previewImgUrl:"",
        prizeImgURL:"../../images/emoji_log.jpg",
    },

   
    //一次只能上传1张图
    localImgChoose:function(){
         wx.chooseImage({
            count: 1, 
            sizeType: ['compressed'], 
            success: function(res) {

                var tempFilePath = res.tempFilePaths[0]
                GLOBAL_PAGE.setData({
                    previewImgUrl:tempFilePath
                })
                // GLOBAL_PAGE.uploadPrepare(1,res.tempFilePaths)
                // var tempFilePath = res.tempFilePaths[0] //图片 
                // console.log( res.tempFilePaths)           
                // GLOBAL_PAGE.uploadFile(tempFilePath)

            },
            fail:function(res){
                console.log(res)
            }
        })
    },

    toGather:function(){
        wx.switchTab({
           url: '../gather/gather',
        })
    }, 

    //帮助按钮，发送图片
    sendHelp:function(){
        GLOBAL_PAGE.setData({
            prizeImgURL:"http://img.12xiong.top/1092_20170214174143.gif"
        })
        wx.showModal({
            title:"帮助成功",
            content:'点击右上角"⋮"，可保存图片',
            confirmText:"看奖励",
            cancelText:"稍后再看",
            success: function(res) {
                if (res.confirm) { //发图成功，预览奖励
                    wx.previewImage({
                        urls: [GLOBAL_PAGE.data.prizeImgURL]
                    })
                } else if (res.cancel) { //点击取消，
                   
                }
            }
        })
    },
    //保存奖励图片
    prizeSave:function(){
        wx.previewImage({
          // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
          urls: [GLOBAL_PAGE.data.prizeImgURL]
        })
    },
   
    toPrivate:function(){
        wx.switchTab({
           url: '../private/private',
        })
    },
    



    onShow:function(){
        var _img_select = wx.getStorageSync(KEY.PAINTER_IMAGE_SELECT) 
        if( _img_select == "" ) //没有选择图片
            return
        else{
            wx.setStorageSync(KEY.PAINTER_IMAGE_SELECT,"")  //立马清除缓存~~避免出错
            GLOBAL_PAGE.imgSelectMode(_img_select)
        }
           
        //正式内容
        // var _img_select = wx.getStorageSync(KEY.PAINTER_IMAGE_SELECT) 
        // if( _img_select == "" ) //没有选择图片
        //     return
        // var _ratio = parseFloat(_img_select.height / _img_select.width)
        // var _width = 200
        // var _height = parseInt( _width * _ratio )
        // wx.canvasToTempFilePath({
        //     canvasId: 'paper',
        //     success: function success(res) {

        //         GLOBAL_PAGE.setData({
        //             isAddPaintImg:true,
        //             paintImgCache:res.tempFilePath,
        //             paintImgSelectUrl:_img_select.img_url,
        //             paintImgSelectWidth:_img_select.width,
        //             paintImgSelectHeight:_img_select.height,
        //             ratioWH: parseFloat(_img_select.height / _img_select.width)
        //         })
        //     },
        //     fail: function complete(e) {
        //         wx.showModal({
        //             title: '请重试',
        //             content:'加载图片错误',
        //             showCancel:false,
        //             confirmText:"知道了",
        //         }) 
        //     },
        //     complete: function complete(e) {
        //        wx.showToast({
        //             title: '添加成功',
        //             icon: 'success',
        //             duration: 1000
        //         })
        //     },
        // });
        //清除选择缓存
        // wx.setStorageSync(KEY.PAINTER_IMAGE_SELECT,"") 
       

// PAINTER_IMAGE_CACHE
//         PAINTER_IMAGE_SELECT
    },

    imgSelectMode:function(img_select){
        var _img_select = img_select
        var _img_url = _img_select.img_url
        var _ratio = parseFloat(_img_select.height / _img_select.width)
        var _width = 200
        var _height = parseInt( _width * _ratio )

        
        //保存当前画布，加载新图片的时候，要画作背景
        wx.canvasToTempFilePath({
            canvasId: 'paper',
            success: function success(res) {
                // wx.showToast({
                //     title: '添加成功',
                //     icon: 'success',
                //     duration: 2000
                // })
                GLOBAL_PAGE.setData({
                    isAddPaintImg:true,           
                    paintImgCache:res.tempFilePath,
                    paintImgSelectUrl:_img_url,
                    paintImgSelectWidth:_width,
                    paintImgSelectHeight:_width*_ratio,
                    ratioWH: _ratio
                })
            },
            fail: function complete(e) {
                wx.showModal({
                    title: '请重试',
                    content:'加载图片错误',
                    showCancel:false,
                    confirmText:"知道了",
                }) 
            },
            complete: function complete(e) {
              
            },
        });
    },
     
    //btn4_1   为画布增加图片
    imgSelect:function(){
        wx.navigateTo({
            url: '../gallery/gallery'
        })
    },

    //btn4_2 确认 将图画到canvas
    imgSelectDraw:function(){
        // 下载图片
        wx.showToast({
            title: '图片正在下载...',
            icon: 'loading',
            duration: 2000
        })
        var img_url = GLOBAL_PAGE.data.paintImgSelectUrl
        var https_url = "https://image.12xiong.top/" + img_url.split("/").pop()
        wx.downloadFile({
            url: https_url, //仅为示例，并非真实的资源
            success: function(res) {
                console.log(res)
                wx.showToast({
                    title: '图片下载成功',
                    icon: 'success',
                    duration: 2000
                })
                const ctx = wx.createCanvasContext('paper')
                var _canvasLeft = GLOBAL_PAGE.data.canvasLeft
                var _titleHeight = 37  //标题固定高度
                
                ctx.drawImage(GLOBAL_PAGE.data.paintImgCache, 0,0,
                    GLOBAL_PAGE.data.canvasWidth,
                    GLOBAL_PAGE.data.canvasHeight 
                )
                ctx.drawImage(res.tempFilePath, 
                    GLOBAL_PAGE.data.selectOject.left - _canvasLeft, 
                    GLOBAL_PAGE.data.selectOject.top - _titleHeight,
                    GLOBAL_PAGE.data.paintImgSelectWidth,
                    GLOBAL_PAGE.data.paintImgSelectHeight 
                )
                ctx.draw()

                 GLOBAL_PAGE.setData({
                    isAddPaintImg:false,
                 })
            },
            fail:function(res){
                wx.showModal({
                    title: '下载图片失败',
                    content:'请重新选择图片',
                    showCancel:false,
                }) 
                GLOBAL_PAGE.setData({
                    isAddPaintImg:false,
                })
            },
            complete:function(res){
                console.log(res)
            },
        })

    },
    
    //btn4_3  取消操作
    imgSelectCancle:function(){
        GLOBAL_PAGE.setData({
            isAddPaintImg:false,
        })
        console.log(GLOBAL_PAGE,GLOBAL_PAGE.data.isAddPaintImg)
    },

    //btn4_4  移动图片
    touchstart:function(event){
        GLOBAL_PAGE.setData({
            touchStart:{
            x:event.touches[0].clientX ,
            y:event.touches[0].clientY 
            }
        })
    },
    //btn4_4  移动图片
    touchmove:function(event){
        var move_x = event.touches[0].clientX - GLOBAL_PAGE.data.touchStart.x 
        var move_y = event.touches[0].clientY - GLOBAL_PAGE.data.touchStart.y

        console.log(move_x ,move_y)
        var watermark = GLOBAL_PAGE.data.selectOject 
    
        var dx = watermark.dx + move_x
        var dy = watermark.dy + move_y
        console.log(watermark.dx,watermark.dy,dx ,dy)
        watermark.dx = dx 
        watermark.dy = dy 
        
        watermark.left = dx - watermark.input_offset_x 
        watermark.top = dy - watermark.input_offset_y 

        GLOBAL_PAGE.setData({
        selectOject:watermark,
        touchStart:{
            x:event.touches[0].clientX ,
            y:event.touches[0].clientY 
        }
        })    
    },

    //btn4_5  图片缩放
    resizeStart:function(event){
        GLOBAL_PAGE.setData({
            resizeStartPoint:{
            x:event.touches[0].clientX ,
            y:event.touches[0].clientY 
            },
            tempWidth:GLOBAL_PAGE.data.paintImgSelectWidth,
            tempHeight:GLOBAL_PAGE.data.paintImgSelectHeight,
        })
        
       console.log(event.touches[0].clientX,event.touches[0].clientY)
    },
    //btn4_6  图片缩放
    resizeMove:function(event){
        var start = GLOBAL_PAGE.data.resizeStartPoint

        var dx = event.touches[0].clientX - start.x
        var dy = event.touches[0].clientY - start.y

        console.log(event.touches[0].clientX,event.touches[0].clientY)
        var w = GLOBAL_PAGE.data.tempWidth + dx 
        GLOBAL_PAGE.setData({
           paintImgSelectWidth: w ,
           paintImgSelectHeight: w*GLOBAL_PAGE.data.ratioWH,
        })


    },
    


    //选择颜色
    chooseColor(event) {
        let paintColor = event.currentTarget.dataset.color;
        global_page.setData({ paintColor });
    },
    //选择画笔大小
    chooseSize(event) {
        let paintSize = event.currentTarget.dataset.size;
        global_page.setData({ paintSize });
    },
    //选择橡皮擦大小
    chooseEraer(event) {
        let eraserSize = event.currentTarget.dataset.size;
        global_page.setData({ eraserSize });
    },

    // 隐藏颜色
    switchColor:function(){
       GLOBAL_PAGE.setData({
           mode:MODE_PENCIL,
           colorShow:!GLOBAL_PAGE.data.colorShow
       })         
    },
    
    // 隐藏铅笔大小
    switchPencil:function(){
        if (GLOBAL_PAGE.data.mode == MODE_ERASER) {
            GLOBAL_PAGE.setData({
                mode:MODE_PENCIL,
            })  
        }
        else{
            GLOBAL_PAGE.setData({
                pencilShow:!GLOBAL_PAGE.data.pencilShow
            }) 
        }
         
    },

    // 隐藏橡皮擦
    switchEraser:function(){       
        if (GLOBAL_PAGE.data.mode == MODE_PENCIL)
            GLOBAL_PAGE.setData({
                mode:MODE_ERASER,
            })   
        else{
            GLOBAL_PAGE.setData({
                eraserShow:!GLOBAL_PAGE.data.eraserShow
            })  
        }
    },



    //btn5 将画布返回初始状态
    resetCanvas:function(){       
        wx.showModal({
            title: '画布重置',
            content:'画布将重置为初始状态，请确认',
            success: function(res) {
                //填充画布 为白色
                const ctx = wx.createCanvasContext('paper')
                ctx.rect(0,0,GLOBAL_PAGE.data.canvasWidth,GLOBAL_PAGE.data.canvasHeight)
                ctx.setFillStyle('white')
                ctx.fill()
                ctx.draw()
                if (GLOBAL_PAGE.data.stepId){  //stepId存在，重新下载图片
                    GLOBAL_PAGE.down()
                }
            }
        }) 
    },

    shareInfo:function(){
        wx.showModal({
            title: '分享提示',
            content:'点击右上角"⋮"，发送给朋友',
            showCancel:false,
            confirmText:"知道了",
        }) 
    },
     //题目内容输入
    inputChange: function(e) {
        GLOBAL_PAGE.setData({
            themeName:e.detail.value,
        })
    },

    modeChange:function(e){
        var _mode = e.currentTarget.dataset.mode
        global_page.setData({
            mode:_mode
        })
    },

    //铅笔模式
    modePecile(event,_context_,clientX,clientY){
        var that = event
        var _context = _context_
        _context.beginPath()
        _context.setStrokeStyle (that.data.paintColor) ;
        _context.setLineWidth (2)
        _context.setGlobalAlpha(0.1)
        _context.moveTo(that.movements[0],that.movements[1])
        _context.lineTo(clientX,clientY)
        _context.stroke(); 
        _context.closePath()
        that.movements = [clientX, clientY];
    },
   
    


     onLancetStart({ touches }) {
         GLOBAL_PAGE.setData({isDraw:true}) //已经画过


        console.log("onLancetStart")
        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];
        this.startX = clientX
        this.startY = clientY
        this.movements = [clientX, clientY];
       
       //记录柳叶刀坐标
        point_lancet = []
        point_lancet.push([this.startX, this.startY])
        point_lancet.push([clientX, clientY])

        //点击画点
        this.movements = [clientX, clientY];//记录上一个点
        this.lastActions = context_lancet.getActions();
        point_lancet.push([clientX, clientY])//柳叶刀记录
        // wx.drawCanvas({ canvasId: "paper-lancet", actions:this.lastActions});
        // this.updateCanvas("paper-lancet",this.lastActions,"false");//更新画布，得出一条线
        // this.updateCanvas("paper-lancet",this.lastActions,true);//更新画布，得出一条线
    },
    
    onLancetMove({ touches }) {
        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];
        
        console.log("onLancetMove")
        global_page.modeLancet(this,context_lancet,clientX,clientY)

        this.movements = [clientX, clientY];//记录上一个点
        this.lastActions = context_lancet.getActions();
        point_lancet.push([clientX, clientY])//柳叶刀记录
        // wx.drawCanvas({ canvasId: "paper-lancet", actions:this.lastActions});
        // this.updateCanvas("paper-lancet",this.lastActions,"false");//更新画布，得出一条线
       this.updateCanvas("paper-lancet",this.lastActions,true);//更新画布，得出一条线
        
    },

    onLancetEnd() {   
        var that = this
        console.log("onLancetEnd")
        var paintColor ,paintSize
        if (GLOBAL_PAGE.data.mode == MODE_PENCIL){
            paintColor = GLOBAL_PAGE.data.paintColor
            paintSize = GLOBAL_PAGE.data.paintSize
        }
        else{
            paintColor = GLOBAL_PAGE.data.eraserColor
            paintSize = GLOBAL_PAGE.data.eraserSize
        }

        var _context = wx.createContext()
        for (var i=1;i<point_lancet.length-1;i++)
        {
            // _context.lineTo(point_lancet[i][0],point_lancet[i][1])
            _context.beginPath()
            _context.setFillStyle (paintColor) ;
            _context.setStrokeStyle (paintColor) ;
            _context.setLineWidth (paintSize)
            // _context.moveTo(that.startX,that.startY)
            _context.setGlobalAlpha(1)
            
            _context.moveTo(point_lancet[i][0],point_lancet[i][1])
            _context.lineTo(point_lancet[i+1][0],point_lancet[i+1][1])

            _context.setLineCap("round")
            _context.setLineJoin("miter")
            _context.setMiterLimit(10)
            _context.fill()
            _context.stroke();  
            _context.closePath()
        }
        

        var _lastActions = _context.getActions();
        global_page.updateCanvas("paper",_lastActions,true);//更新画布，得出一条线

        var temp_context = wx.createContext()
        var temp_action = temp_context.getActions();
        this.updateCanvas("paper-lancet",temp_action,false);
        // global_page.setData({
        //     displayLancet:false
        // })
   },

    //柳叶笔模式
    modeLancet(event,_context_,clientX,clientY){

        var paintColor ,paintSize
        if (GLOBAL_PAGE.data.mode == MODE_PENCIL){
            paintColor = GLOBAL_PAGE.data.paintColor
            paintSize = GLOBAL_PAGE.data.paintSize
        }
        else{
            paintColor = GLOBAL_PAGE.data.eraserColor
            paintSize = GLOBAL_PAGE.data.eraserSize
        }
         //仿画吧，柳叶刀
        var that = event
        var _context = _context_
        _context.beginPath()
        _context.setFillStyle (paintColor) ;
        _context.setStrokeStyle (paintColor) ;
        // _context.setLineWidth (10)
        _context.setLineWidth (paintSize)
        // _context.moveTo(that.startX,that.startY)
        _context.setGlobalAlpha(1)
        _context.moveTo(that.movements[0],that.movements[1])
        // _context.lineTo(that.movements[0],that.movements[1])
        _context.lineTo(clientX,clientY)
        _context.setLineCap("round")
        _context.setLineJoin("miter")
        _context.setMiterLimit(10)
        _context.fill()
        _context.stroke();  
        _context.closePath()
        that.movements = [clientX, clientY];
    },
    //橡皮擦模式
    getAngle(arc) {  
        return Math.PI * (arc / 180);  
    } , 
    updateCanvas(canvasId,actions,reserve) {
        // console.log(actions)
        wx.drawCanvas({ canvasId: canvasId, actions,reserve:reserve}); //wx自带绘图接口
    },

    canvasIdErrorCallback: function (e) {
        console.error(e.detail.errMsg);
    },

    reDraw:function(){
        const ctx = wx.createCanvasContext('paper')
        ctx.drawImage(GLOBAL_PAGE.data.tempImage, 0, 0, 250, 250)
        ctx.draw()
        console.log("OK")
        // console.log(ctx)
    },

    up:function(){
        console.log(GLOBAL_PAGE.data.tempImage)
        GLOBAL_PAGE.saveYun(GLOBAL_PAGE.data.tempImage)
    },

    
    //下载该step的图片地址，存入缓存，再画到canvas上
    down:function(){
        const ctx = wx.createCanvasContext('paper')
        // var url = "http://www.12xiong.top/static/magick/upload/20161018173657.png"
        var url = GLOBAL_PAGE.data.imgUrl

        // var https_url = "https://oje4rojkn.qnssl.com/" + url.split("/").pop()
        var https_url = "https://image.12xiong.top/" + url.split("/").pop()
         
        console.log("in down:",url,https_url)
        //下载
        wx.showToast({
            title: '图片正在下载...',
            icon: 'loading',
            duration: 10000,
            mask:true,
        })
        wx.downloadFile({
            url: https_url, //仅为示例，并非真实的资源
            success: function(res) {
                console.log("down downloadFile success:")
                console.log(res)
                wx.hideToast()
                wx.showToast({
                    title: '图片下载成功',
                    icon: 'success',
                    duration: 2000
                })
                
                console.log(https_url)
                console.log(res.tempFilePath)
                console.log(GLOBAL_PAGE.data.canvasWidth)
                console.log(GLOBAL_PAGE.data.canvasHeight)
                ctx.drawImage(res.tempFilePath, 0, 0,GLOBAL_PAGE.data.canvasWidth, GLOBAL_PAGE.data.canvasHeight)
                ctx.draw()
                console.log("ctx:",ctx)
            },
            fail:function(res){
                wx.hideToast()
                wx.showModal({
                    title: '下载图片失败',
                    content:'请点击左上角“<-”退出再继续画',
                    showCancel:false,
                }) 
                
            },
            complete:function(res){
                console.log(res)
                
            },
        })
    },

    onShareAppMessage: function () { 
        var status = GLOBAL_PAGE.data.joinStatus 

        //抢画分享，stepId已改变，进入新的step直接抢 ；
        //画到一半，未保存分享，stepId为改变，进入之前抢的界面；用户抢失败
        if( status == PAINTER_STEP_SHARE || status == PAINTER_STEP_BUSY) {
            console.log(
                GLOBAL_PAGE.data.stepId,
                GLOBAL_PAGE.data.imgUrl,
                GLOBAL_PAGE.data.themeName,
                PAINTER_STEP_SHARE
                )
            return {
                title: '一起画吉吧',
                desc: '邀你来添两笔吉祥如意',
                path: '/pages/painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_SHARE
            }
        }
        else {
            return {
                title: '一起画吉吧',
                desc: '邀你来添两笔吉祥如意',
                path: '/pages/painter/painter'
            }
        }
    },
        
    onLoad(option) {
        global_page = this
        GLOBAL_PAGE = this
        console.log("painter:",option.aa)
        
        wx.getSystemInfo({
          success: function(res) {
            //设置屏幕宽/高
            // console.log(res)
            // that.globalData.windowWidth = res.windowWidth
            // that.globalData.windowHeight = res.windowHeight
            load(res.windowWidth,res.windowHeight)
          }
        })

        function load(windowWidth,windowHeight){
            // mode 1 长画布 设置画布大小，左偏移 
            var canvasWidth , canvasHeight
            var canvasWidth = windowWidth
            // var _ratio = 0.75
            // var canvasHeight = APP.globalData.windowHeight - 42 - 60
            // var canvasHeight = APP.globalData.windowHeight - 37 - 60
            var canvasHeight = windowHeight- 45 - 60 //width全部铺满
            if ( canvasWidth >= canvasHeight*0.75 )
                canvasWidth = parseInt(canvasHeight*0.75 )
            else
                canvasHeight = canvasWidth*4/3
                
            //mode 2 方形画布
            // var canvasWidth , canvasHeight
            // var canvasWidth = APP.globalData.windowWidth
            // var canvasHeight = APP.globalData.windowWidth
            

            GLOBAL_PAGE.setData({
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                canvasLeft: (windowWidth-canvasWidth)/2,
            })
            
            context_lancet = wx.createContext() //创建模拟画布

            //填充画布 为白色
            const ctx = wx.createCanvasContext('paper')
            ctx.rect(0,0, canvasWidth,canvasHeight)
            ctx.setFillStyle('white')
            ctx.fill()
            ctx.draw()

            if (option.step_id){  //有themeID，已经抢到画
                GLOBAL_PAGE.setData({
                    joinStatus:option.join_status, 
                    stepId:option.step_id,
                    imgUrl:option.img_url,
                    themeName:option.theme_name,
                })
                //下载画
                console.log("下载画画：",GLOBAL_PAGE.data.stepId,GLOBAL_PAGE.data.imgUrl)
                GLOBAL_PAGE.down()
                //Todo 查询这幅画是可抢，还是继续画
            }
            else{ //未传入step_id，能创建新的画
                GLOBAL_PAGE.setData({ joinStatus:PAINTER_STEP_FREE, })
            }   
            
            //更新画笔颜色
            GLOBAL_PAGE.getNewColor()

            //必须要登陆以后再做的事情
            if(APP.globalData.isLogin == true)
                GLOBAL_PAGE.onInit(option)
            else
                APP.login(option)
        }

    },

    //必须要登陆以后发起的请求，在这里完成
    onInit:function(option){
       //Todo 登陆过后做的请求
       
    },

    getNewColor:function(){ //在线获取颜色列表
        wx.request({
            url: API.PAINTER_COLOR(), 
            method:"GET",
            success: function(res) {
                       
        //      colors: ['#666666','#000000', '#FF0000', '#FFA500', 
        // '#FFFF00', '#008000', '#0000FF', '#ffffff',],
        // //选中的颜色
        // paintColor: '#666666',
                var object = res.data
                GLOBAL_PAGE.setData({
                    colors:object.colors,
                    paintColor:object.paint_color
                })
            },
        })
    },

    //111 抢画 
    snatch:function(){
        //防止多次点抢
        if (GLOBAL_PAGE.data.lockSnatch){
            wx.showModal({
                title: "抢太快了",
                content:"请休息几秒再抢抢~",
                confirmText:"知道了",
                showCancel:false,
            })
            return
        }
        GLOBAL_PAGE.setData({ lockSnatch:true})
        setTimeout(function() {
             GLOBAL_PAGE.setData({ lockSnatch:false})
        }, 5000)


        wx.request({
            url: API.PAINTER_SNATCH(), 
            method:"GET",
            data: {
                session: wx.getStorageSync(KEY.session),
                theme_id:'',
                step_id:GLOBAL_PAGE.data.stepId,
            },
            success: function(res) {
                var object = res.data
                if (object.status == "true")
                {
                    console.log("snatch success",object)
                    //设置播放step
                    // 已经抢过画了，不能抢，要继续画
                     if(object.is_success== "no_snatch"){
                        console.log("snatch success no_snatch")
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            confirmText:"继续画",
                            success: function(res) {
                                if (res.confirm) {
                                    var _join_status = object.join_status
                                    var _step_id = object.step_id
                                    var _img_url = object.img_url
                                    var _theme_name = object.theme_name
                                    var url = '../painter/painter?step_id='+_step_id+'&img_url='+_img_url+'&theme_name='+_theme_name +'&join_status='+_join_status
                                    wx.redirectTo({
                                         url: url
                                    })
                                }
                            }
                        })
                    }
                    // 抢画成功
                    else  if( object.is_success== "true")
                    {
                        console.log("snatch success true")
                        // GLOBAL_PAGE.setData({
                        //     joinStatus: PAINTER_STEP_BUSY,
                        // })
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            showCancel:false,
                            confirmText:"现在画",
                            success: function(res) {
                                if (res.confirm) {
                                    var _join_status = PAINTER_STEP_BUSY
                                    var _step_id = object.step_id
                                    var _img_url = object.img_url
                                    var _theme_name = object.theme_name
                                    var url = '../painter/painter?step_id='+_step_id+'&img_url='+_img_url+'&theme_name='+_theme_name +'&join_status='+_join_status
                                    wx.redirectTo({
                                         url: url
                                    })
                                }
                            }
                        })
                        // wx.showModal({
                        //     title: object.title,
                        //     content:object.content,
                        //     showCancel:false,
                        // })
                        
                        // setTimeout(function() {
                        //     GLOBAL_PAGE.down()
                        // }, 1000)
    //                     console.log(GLOBAL_PAGE.data.stepId)
    //                     console.log(GLOBAL_PAGE.data.imgUrl)
    //                     console.log(GLOBAL_PAGE.data.themeName)
    //                     console.log(PAINTER_STEP_BUSY)
    //                      var url = '../painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_BUSY
    // wx.redirectTo({
    //   url: url
    // })
                        
                    }
                    else  //抢画失败，继续
                    {
                        console.log("snatch success false")
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            confirmText:"画一幅",
                            showCancel:false,
                            success: function(res) {
                                if (res.confirm) {
                                    wx.redirectTo({
                                    url: '../painter/painter'
                                    })
                                }
                            }
                        })
                    }
                }
                else
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })
            },
            fail:function(res){
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })
            },
        })
    },




    //完成并跳转到播放器
    saveToShare:function(){
        //检测主题是否为空
        if( GLOBAL_PAGE.data.themeName == ""){
            wx.showModal({
              title: '请输入主题',
              showCancel:false,
            })
            return
        }
         //防止多次点抢
        if (GLOBAL_PAGE.data.lockComplete){
            wx.showModal({
                title: "点太快了",
                content:"请休息几秒再提交~",
                confirmText:"知道了",
                showCancel:false,
            })
            return
        }
        GLOBAL_PAGE.setData({ lockComplete:true})
        setTimeout(function() {
             GLOBAL_PAGE.setData({ lockComplete:false})
        }, 5000)

        //测试函数
        // if(GLOBAL_PAGE.data.joinStatus == PAINTER_STEP_FREE)
        //     // console.log("未参与")
        //     GLOBAL_PAGE.saveStart()
        // else if(GLOBAL_PAGE.data.joinStatus == PAINTER_STEP_BUSY)  
        //     // console.log("正在参与") 
        //     GLOBAL_PAGE.saveContinue()

         //正式函数   
        GLOBAL_PAGE.saveTempFile()
    },
    //1 保存为临时文件
    saveTempFile:function(){
        console.log("1 保存为临时文件")
        wx.canvasToTempFilePath({
            canvasId: 'paper',
            success: function success(res) {
                wx.showToast({
                    title: '您的大作正在上传...',
                    icon: 'loading',
                    duration: 10000,
                    // mask:true,
                })
                //上传云后台
                GLOBAL_PAGE.saveYun(res.tempFilePath)
                //预览显示
                // GLOBAL_PAGE.data.tempImage = res.tempFilePath
 
            },
            complete: function complete(e) {

                console.log(e.errMsg);
            }
        });
    },


    //2 上传到云服务器
    //imgUrl + canvas画手，上传后获取imgUpload地址，绑定到下一步step
    saveYun:function(file_path){
        console.log("2 上传到云服务器")
        var _type = file_path.split(".").pop()

        //获取默认目录
        var _category_id;
        var user_info = wx.getStorageSync('USER_INFO')
        
        if (user_info == ""){ //登陆失败，重新登录
            wx.showModal({
                title: '登陆失败',
                content:'请重新登录',
                showCancel:false,
                success: function(res) {
                    APP.login()
                }
            }) 
            return
        }else{ // 默认目录
            _category_id = user_info.default_category_id
        }

        var _tempCatId = 1  // 需要根据storage拿到默认目录id
        wx.request({
            url: API.uploadToken(), 
            data:{
                'session': wx.getStorageSync(KEY.session),
                "type":_type,
                "category_id":_category_id ,
            },
            success: function(res){
                var data = res.data
                console.log(data)
                if(data.status == "true")
                {
                    wx.uploadFile({
                        url: 'https://up.qbox.me',
                        // filePath: tempFilePaths[0],//图片
                        filePath: file_path,//小视频
                        name: 'file',
                        formData:{
                            'key': data.key,
                            'token': data.token,
                        },
                        success: function(res){
                            console.log("3 上传成功")
                            var data = JSON.parse(res.data);
                            console.log(data)
                            if(data.status == "true")
                            {   
                                // wx.hideToast()
                                wx.showToast({
                                    title: '完成，让朋友来画两笔',
                                    icon: 'success',
                                    duration: 2000
                                })
                                // 上传成功，更新本地库
                                console.log("emoticon:")
                                var e = wx.getStorageSync(KEY.emoticon)
                                if(e != ""){ //本地有emoticon 的缓存
                                    e.splice(0, 0, data.img); //从第一位插入
                                    wx.setStorageSync(KEY.emoticon,e)
                                }
                                  
                                GLOBAL_PAGE.setData({
                                    imgUrl:data.img.yun_url,
                                    uploadStatus:1, //上传成功
                                    isDraw:false  //,用户又回到没画过的状态
                                })    
                                  // console.log("isDraw:",GLOBAL_PAGE.data.isDraw)
                                if(GLOBAL_PAGE.data.joinStatus == PAINTER_STEP_FREE){
                                    console.log("未参与")
                                    GLOBAL_PAGE.saveStart()
                                }
                                else if(GLOBAL_PAGE.data.joinStatus == PAINTER_STEP_BUSY) {
                                    console.log("正在参与") 
                                    GLOBAL_PAGE.saveContinue()
                                } 
                            } 
                            else{
                                wx.showModal({
                                title: '网络连接失败，请重试',
                                showCancel:false,
                                })
                                GLOBAL_PAGE.setData({isUpload:false})
                            }    
                        },
                        fail (error) {
                            console.log(error)
                            wx.showModal({
                            title: '网络连接失败，请重试',
                            showCancel:false,
                            })
                            GLOBAL_PAGE.setData({isUpload:false})
                        },
                        complete (res) {
                            console.log(res) 
                        }
                    })
                }
                else{
                    wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                    })
                    GLOBAL_PAGE.setData({isUpload:false})
                }              
            },
            fail:function(res){
                wx.showModal({
                    title: '网络连接失败，请重试',
                    showCancel:false,
                })
                GLOBAL_PAGE.setData({isUpload:false})
            },
            complete:function(res) { 

            },
        })
    },

    // 3.1 创建新画
    saveStart:function(){
        
        console.log(GLOBAL_PAGE.data.imgUrl)
        wx.request({
        url: API.PAINTER_START(), 
        method:"GET",
        data: {
            session: wx.getStorageSync(KEY.session),
            theme_name:GLOBAL_PAGE.data.themeName,
            img_url:GLOBAL_PAGE.data.imgUrl,
            // img_url:"http://image.12xiong.top/1_20170118133253.png",
        },
        success: function(res) {
            var object = res.data
            if (object.status == "true")
            {
                //Todo 改变状态为free
                console.log(object.img_url)
                GLOBAL_PAGE.setData({
                    joinStatus:PAINTER_STEP_SHARE,
                    themeName:object.theme_name ,
                    stepId: object.step_id,
                    imgUrl:object.img_url, 
                })
                GLOBAL_PAGE.down()
                // console.log(object)
                // var _share = object.share
                // GLOBAL_PAGE.setData({
                //     themeId:object.theme_id,
                //     stepId:object.step_id,
                //     stepNumber:object.step_number,
                // })

                // GLOBAL_PAGE.navigateToPlayer()
            }
            else
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },

      })
    },

    // 3.2 创建新画
    saveContinue:function(){
        
        wx.request({
        url: API.PAINTER_CONTINUE(), 
        method:"GET",
        data: {
            session: wx.getStorageSync(KEY.session),
            // theme_name:GLOBAL_PAGE.data.themeName,
            step_id:GLOBAL_PAGE.data.stepId,
            img_url:GLOBAL_PAGE.data.imgUrl,
            // img_url:"http://image.12xiong.top/1_20170114161832.jpg", //图图2
        },
        success: function(res) {
            var object = res.data
            if (object.status == "true")
            {
                if( object.is_success== "true"){
                    // GLOBAL_PAGE.setData({
                    //     themeId:object.theme_id,
                    //     stepId:object.step_id,
                    //     stepNumber:object.step_number,
                    // })
                    //Todo 改变状态为free
                    // wx.setStorageSync(KEY.PAINTER_USER_IS_FREE,true)
                    GLOBAL_PAGE.setData({
                        joinStatus:PAINTER_STEP_SHARE,
                        themeName:object.theme_name ,
                        stepId: object.step_id,
                        imgUrl:object.img_url, 
                    })
                    GLOBAL_PAGE.down()
                }
                else{
                    wx.showModal({
                        title: object.title,
                        content:object.content,
                        showCancel:false,
                    })
                }
            }
            else
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },
        fail:function(res){
            wx.showModal({
                title: '网络连接失败，请重试',
                showCancel:false,
            })
        },

      })
    },
    
    // //4 导航：播放器 
    // navigateToPlayer: function() {
    //     // var url = '../player/player?img_url=' + GLOBAL_PAGE.data.imgUpload
    //     // var url = '../player/player?img_url=http://image.12xiong.top/1_20170118133253.png'
    //     // GLOBAL_PAGE.setData({
    //     //             themeId:object.theme_id,
    //     //             stepId:object.step_id,
    //     //             stepNumber:object.step_number,
    //     //         })
    //     var url = '../player/player?theme_id='+GLOBAL_PAGE.data.themeId+ "&step_id="+GLOBAL_PAGE.data.stepId + "&step_number="+GLOBAL_PAGE.data.stepNumber
    //     wx.redirectTo({
    //         url: url
    //     })
    // },

    // 5 返回一起画主页
    navigateToSwitch: function() {
        if(GLOBAL_PAGE.data.isDraw) //已开始画，返回首页做提示
            wx.showModal({
                title: '温馨提示',
                content:'未“完成”的作品无法保存，确定离开画板？',
                success: function(res) {
                    if (res.confirm) {
                        wx.switchTab({
                            url: "../together/together",
                            success: function (e) {  
                                var page = getCurrentPages().pop();  
                                if (page == undefined || page == null) return;  
                                page.onShow();  
                            }  
                        })
                    }
                }
            }) 
        else
            wx.switchTab({
                url: "../together/together",
                success: function (e) {  
                    var page = getCurrentPages().pop();  
                    if (page == undefined || page == null) return;  
                    page.onShow();  
                }  
            })
    },
    
});






