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

var PAINTER_STEP_LOAD = 0;
var PAINTER_STEP_FREE = 1; //未参与，创建新的
var PAINTER_STEP_BUSY = 2; //正在参与，down上step的
var PAINTER_STEP_SHARE = 3; //待分享
Page({
    data: {
        //调色盘列表
        colors: ['#666666', '#FF0000', '#FFA500', 
        '#FFFF00', '#008000', '#0000FF', '#ffffff'],
        //选中的颜色
        paintColor: '#666666',
        context:"",

        mode:"lancet",

        displayLancet:true,
        tempImage:null,
        isUpload:null,

        themeName:"一起画表情",
        imgUpload:"",

        uploadStatus: 0 , // 0 未上传上传  1 上传成功

        themeId:null,
        stepId:null,
        stepNumber:null,
        
        imgUrl:"", //下载的图片


        joinStatus: 1 , //  1 未参与 ， 2正在参与
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
   
    modeEraser(){},

    chooseColor(event) {
        let paintColor = event.currentTarget.dataset.color;
        global_page.setData({ paintColor });
    },

     onLancetStart({ touches }) {

        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];
        this.startX = clientX
        this.startY = clientY
        this.movements = [clientX, clientY];
       
       //记录柳叶刀坐标
        point_lancet = []
        point_lancet.push([this.startX, this.startY])
        point_lancet.push([clientX, clientY])

    },
    
    onLancetMove({ touches }) {
        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];
        // console.log(clientX, clientY)
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
     
        var _context = wx.createContext()
        for (var i=1;i<point_lancet.length-1;i++)
        {
            // _context.lineTo(point_lancet[i][0],point_lancet[i][1])
            _context.beginPath()
            _context.setFillStyle (that.data.paintColor) ;
            _context.setStrokeStyle (that.data.paintColor) ;
            _context.setLineWidth (10)
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

         //仿画吧，柳叶刀
        var that = event
        var _context = _context_
        _context.beginPath()
        _context.setFillStyle (that.data.paintColor) ;
        _context.setStrokeStyle (that.data.paintColor) ;
        _context.setLineWidth (10)
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

    

    down:function(){
        const ctx = wx.createCanvasContext('paper')
        // var url = "http://www.12xiong.top/static/magick/upload/20161018173657.png"
        var url = GLOBAL_PAGE.data.imgUrl
        console.log(url)
        //下载
        wx.downloadFile({
            url: url, //仅为示例，并非真实的资源
            success: function(res) {
                console.log(res)
                // GLOBAL_PAGE.data.tempImage = res.tempFilePath

                ctx.drawImage(res.tempFilePath, 0, 0, 250, 250)
                ctx.draw()
               
                // wx.previewImage({
                //     current: res.tempFilePath, // 当前显示图片的http链接
                //     urls: [res.tempFilePath] // 需要预览的图片http链接列表
                // })
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
            return {
                title: '大家一起画',
                desc: '你的好友邀请你来画画',
                path: '/pages/painter/painter?step_id='+GLOBAL_PAGE.data.stepId+'&img_url='+GLOBAL_PAGE.data.imgUrl+'&theme_name='+GLOBAL_PAGE.data.themeName +'&join_status='+PAINTER_STEP_SHARE
            }
        }
        else {
            return {
                title: '大家一起画',
                desc: '你的好友邀请你来画画',
                path: '/pages/painter/painter'
            }
        }
    },
        
    onLoad(option) {
        global_page = this
        GLOBAL_PAGE = this
        console.log("painter:",option.aa)

        //模拟，继续画的状态
        // option = {
        //     step_id:3,
        //     img_url:"http://image.12xiong.top/1_20170118133253.png",
        //     theme_name:"一起画表情"
        // }


        if (option.step_id){  //有themeID，已经抢到画
            GLOBAL_PAGE.setData({
                joinStatus:option.join_status, 
                stepId:option.step_id,
                imgUrl:option.img_url,
                themeName:option.theme_name,
            })
            //下载画
            GLOBAL_PAGE.down()
            //Todo 查询这幅画是可抢，还是继续画
        }
        else{ //未传入step_id，能创建新的画
             GLOBAL_PAGE.setData({ joinStatus:PAINTER_STEP_FREE, })
        }
         
        context_lancet = wx.createContext() //创建模拟画布
    },

    //111 抢画 
    snatch:function(){
        wx.request({
            url: API.PAINTER_SNATCH(), 
            method:"GET",
            data: {
                session: wx.getStorageSync(KEY.session),
                // theme_id:GLOBAL_PAGE.data.themeId,
                step_id:GLOBAL_PAGE.data.stepId,
            },
            success: function(res) {
                var object = res.data
                if (object.status == "true")
                {
                    console.log(object)
                    //设置播放step
                    
                    if( object.is_success== "true")
                    {
                        wx.showModal({
                            title: object.title,
                            content:object.content,
                            showCancel:false,
                        })
                        GLOBAL_PAGE.setData({
                            joinStatus: PAINTER_STEP_BUSY,
                        })
                    }
                    
                    else  //抢画失败，继续
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
            
        //测试函数
        // if(GLOBAL_PAGE.data.joinStatus == PAINTER_STEP_FREE)
        //     // console.log("未参与")
        //     GLOBAL_PAGE.saveStart()
        // else if(GLOBAL_PAGE.data.joinStatus == PAINTER_STEP_BUSY)  
        //     // console.log("正在参与") 
        //     GLOBAL_PAGE.saveContinue()

         //正式函数   
        // GLOBAL_PAGE.saveTempFile()
    },
    //1 保存为临时文件
    saveTempFile:function(){
        console.log("1 保存为临时文件")
        wx.canvasToTempFilePath({
            canvasId: 'paper',
            success: function success(res) {
                wx.showToast({
                    title: '导出图片成功',
                    icon: 'success',
                    duration: 2000
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
    saveYun:function(file_path){
        console.log("2 上传到云服务器")
        var _type = file_path.split(".").pop()
        var _tempCatId = 1
        wx.request({
            url: API.uploadToken(), 
            data:{
                'session': wx.getStorageSync(KEY.session),
                "type":_type,
                "category_id":_tempCatId ,
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
                                // 上传成功，更新本地库
                                var e = wx.getStorageSync(KEY.emoticon)
                                e.splice(0, 0, data.img); //从第一位插入
                                // e.push(data.img)
                                wx.setStorageSync(KEY.emoticon,e)
                                // GLOBAL_PAGE.renderEmoticon()
                                GLOBAL_PAGE.setData({
                                    imgUpload:data.img.img_url,
                                    uploadStatus:1 //上传成功
                                })    

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
        
        wx.request({
        url: API.PAINTER_START(), 
        method:"GET",
        data: {
            session: wx.getStorageSync(KEY.session),
            theme_name:GLOBAL_PAGE.data.themeName,
            //   img_url:GLOBAL_PAGE.data.imgUpload,
            img_url:"http://image.12xiong.top/1_20170118133253.png",
        },
        success: function(res) {
            var object = res.data
            if (object.status == "true")
            {
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
            //   img_url:GLOBAL_PAGE.data.imgUpload,
            step_id:GLOBAL_PAGE.data.stepId,
            // img_url:"http://image.12xiong.top/1_20170118133253.png", //图1
            img_url:"http://image.12xiong.top/1_20170114161832.jpg", //图图2
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
    
    //4 导航：播放器 
    navigateToPlayer: function() {
        // var url = '../player/player?img_url=' + GLOBAL_PAGE.data.imgUpload
        // var url = '../player/player?img_url=http://image.12xiong.top/1_20170118133253.png'
        // GLOBAL_PAGE.setData({
        //             themeId:object.theme_id,
        //             stepId:object.step_id,
        //             stepNumber:object.step_number,
        //         })
        var url = '../player/player?theme_id='+GLOBAL_PAGE.data.themeId+ "&step_id="+GLOBAL_PAGE.data.stepId + "&step_number="+GLOBAL_PAGE.data.stepNumber
        wx.redirectTo({
            url: url
        })
    },
});





