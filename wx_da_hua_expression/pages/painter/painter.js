var Api = require('../../utils/api.js');
var Key = require('../../utils/storage_key.js');
// var View = require('../../utils/view.js');
// var Menu = require('../../utils/menu.js');
var GLOBAL_PAGE
var global_page
// var context
var context_lancet
var context_1
var point_lancet = []
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

        imgUpload:"",
    },

    eventBase:function(e){
        global_page.eventListen(e)
        global_page.eventDisplay(e.currentTarget.dataset.action)
    },

    eventDisplay:function(action){
        var _display = {
            }
        if (_display.hasOwnProperty(action))
            _display[action]()
        // View.Switch.Work() //触发效果
    },

    eventListen:function(e){
        var _eventDict = {
            "modeChange":global_page.modeChange,
            "save":global_page.save,
        }
        if (_eventDict.hasOwnProperty(e.currentTarget.dataset.action))
            _eventDict[e.currentTarget.dataset.action](e) 
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

    // onTouchStart({ touches }) {
    //     //  global_page.setData({
    //     //     displayLancet:true
    //     // })
    //     const  clientX = touches[0]['x'];
    //     const  clientY = touches[0]['y'];

    //     this.startX = clientX
    //     this.startY = clientY
    //     this.movements = [clientX, clientY];

    //     var that = this
    //     this.context = wx.createContext()
    //     this.context.beginPath()
    //     this.context.setFillStyle (that.data.paintColor) ;
    //     // this.context.setStrokeStyle (that.data.paintColor) ;
    //     // this.context.setLineWidth (2)
    //     this.context.moveTo(that.startX,that.startY)
    //     this.context.setGlobalAlpha(0.9)
    //     this.context.lineTo(that.movements[0],that.movements[1])
       
    // },
    
    // onTouchMove({ touches }) {
    //     const  clientX = touches[0]['x'];
    //     const  clientY = touches[0]['y'];
             
    //     global_page.modePecile(this,clientX,clientY)
    //     //仿画吧，柳叶刀
    //     // switch(global_page.data.mode){
    //     // case "pecile":global_page.modePecile(this,clientX,clientY);break;
    //     // case "lancet":global_page.modeLancet(this,clientX,clientY);break;
    //     // case "eraser":global_page.modeEraser(this);break;
    //     // }
    //     var that = this
    //     that.context.lineTo(clientX,clientY)
    //     // that.context.setLineCap("round")
    //     // that.context.setLineJoin("miter")
    //     // that.context.setMiterLimit(10)
    //     // this.context.setGlobalAlpha(0.8)
       
    //     // context.stroke();  
    //     that.movements = [clientX, clientY];

    // },

    // onTouchEnd() {
    //     var that = this
    //      that.context.fill()
    //     that.context.closePath()
        
    //     global_page.setData({context:that.context})

    //     this.lastActions = that.context.getActions();
    //     global_page.updateCanvas("paper",this._lastActions,"true");//更新画布，得出一条线
    // },
   
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

        // global_page.setData({
        //     displayLancet:true
        // })
 
        // console.log(clientX, clientY)
        
        // context_1 = wx.createContext()
        // context_1.beginPath()
        // // context_1.setFillStyle ('#008000') ;
        // // context_1.setStrokeStyle ('#008000') ;
        // context_1.setGlobalAlpha(0.5)
        // context_1.setLineWidth (2)
        // context_1.moveTo(point_lancet[0][0],point_lancet[0][1])
        // context_1.fill()
        // context_1.stroke()
    },
    
    onLancetMove({ touches }) {
        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];
        // console.log(clientX, clientY)
        global_page.modeLancet(this,context_lancet,clientX,clientY)

        //第三种方法
        // context_1.lineTo(point_lancet[i][0],point_lancet[i][1])
        // context_1.closePath()

        // 把当前的记录全画出来
        // var _context = wx.createContext()
        // _context.beginPath()
        // _context.setFillStyle ('#008000') ;
        // _context.setStrokeStyle ('#008000') ;
        // _context.setGlobalAlpha(0.5)
        // _context.setLineWidth (2)
        // _context.moveTo(point_lancet[0][0],point_lancet[0][1])
        // for (var i=1;i<point_lancet.length;i++)
        //     _context.lineTo(point_lancet[i][0],point_lancet[i][1])
        // _context.fill()
        // _context.stroke();  
        // _context.closePath()
        // this.movements = [clientX, clientY];//记录上一个点
        // this.lastActions = _context.getActions();
        // context_lancet.stroke()
        // context_lancet.closePath()

        this.movements = [clientX, clientY];//记录上一个点
        this.lastActions = context_lancet.getActions();
        point_lancet.push([clientX, clientY])//柳叶刀记录
        // wx.drawCanvas({ canvasId: "paper-lancet", actions:this.lastActions});
        // this.updateCanvas("paper-lancet",this.lastActions,"false");//更新画布，得出一条线
       this.updateCanvas("paper-lancet",this.lastActions,true);//更新画布，得出一条线
        
    },

    onLancetEnd() {   
        var that = this
        // var _context = wx.createContext()
        // _context.beginPath()
        // // _context.setFillStyle ('#008000') ;
        // // _context.setStrokeStyle (that.data.paintColor) ;
        // _context.setFillStyle (that.data.paintColor) ;
        // _context.setStrokeStyle (that.data.paintColor) ;
        // _context.setGlobalAlpha(1)
        // _context.setLineWidth (10)
        // _context.setLineCap("round")
        // _context.setLineJoin("miter")
        // _context.setMiterLimit(10)
        // _context.moveTo(point_lancet[0][0],point_lancet[0][1])
        // for (var i=1;i<point_lancet.length;i++)
        //     _context.lineTo(point_lancet[i][0],point_lancet[i][1])
        // // _context.setStrokeStyle()
        // _context.stroke()
        // _context.fill()
        // _context.stroke();  
        // _context.closePath()
        // var that = event
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
        // var that = event
        // var _context = _context_
        // _context.beginPath()
        // _context.setFillStyle (that.data.paintColor) ;
        // _context.setStrokeStyle (that.data.paintColor) ;
        // _context.setLineWidth (10)
        // _context.moveTo(that.startX,that.startY)
        // _context.setGlobalAlpha(0.2)
        // _context.lineTo(that.movements[0],that.movements[1])
        // _context.lineTo(clientX,clientY)
        // _context.setLineCap("round")
        // _context.setLineJoin("miter")
        // _context.setMiterLimit(10)
        // _context.fill()
        // _context.stroke();  
        // _context.closePath()
        // that.movements = [clientX, clientY];

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

    //  save(){
    //     // var src = wx.canvasToTempFilePath({ canvasId: 'paper'})
    //     // console.log(src)
    //     wx.toTempFilePath({
    //         canvasId: 'paper',
    //         success: function (res) {
    //             console.log(res)
    //         },
    //         fail: function (res) {
    //             console.log(res)
    //         }
    //     })
    // },
     

    reDraw:function(){
        const ctx = wx.createCanvasContext('paper')
        ctx.drawImage(GLOBAL_PAGE.data.tempImage, 0, 0, 250, 250)
        ctx.draw()
        console.log("OK")
        // console.log(ctx)
    },

    up:function(){
        console.log(GLOBAL_PAGE.data.tempImage)
        GLOBAL_PAGE.uploadFile(GLOBAL_PAGE.data.tempImage)
    },

    
  //正式上传 4-7
    uploadFile:function(file_path){
        var _type = file_path.split(".").pop()
        var _tempCatId = 1
        wx.request({
            url: Api.uploadToken(), 
            data:{
                'session': wx.getStorageSync(Key.session),
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
                            console.log("上传成功")
                            var data = JSON.parse(res.data);
                            console.log(data)
                            if(data.status == "true")
                            {   
                                // 上传成功，更新本地库
                                var e = wx.getStorageSync(Key.emoticon)
                                e.splice(0, 0, data.img); //从第一位插入
                                // e.push(data.img)
                                wx.setStorageSync(Key.emoticon,e)
                                // GLOBAL_PAGE.renderEmoticon()
                                GLOBAL_PAGE.setData({
                                    imgUpload:data.img.img_url
                                })    

                                GLOBAL_PAGE.navigateToPlayer()

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

    down:function(){
        const ctx = wx.createCanvasContext('paper')
        // var url = "http://image.12xiong.top/1_20170115231702.jpg"
        // var url = "https://www.12xiong.top/static/magick/upload/180_1_20170113173415.jpg"
        // var url = "https://www.12xiong.top/static/magick/upload/20161018173657.png"
        var url = "http://www.12xiong.top/static/magick/upload/20161018173657.png"
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

        //保存
        // wx.saveFile({
        //     tempFilePath: url,
        //     success: function success(res) {
        //         console.log('saved::' + res.savedFilePath);
        //         GLOBAL_PAGE.data.tempImage = res.savedFilePath
        //         wx.previewImage({
        //             current: res.savedFilePath, // 当前显示图片的http链接
        //             urls: [res.savedFilePath] // 需要预览的图片http链接列表
        //         })
        //     },
        //     complete: function fail(e) {

        //         console.log(e.errMsg);
        //     }
        // });



        
        // ctx.drawImage(url, 0, 0, 250, 250)
        // ctx.draw()
        // console.log("OK")
        // console.log(ctx)


        // wx.chooseImage({
        //   success: function(res){
            // ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
            // ctx.draw()
        //   }
        // })
    },

    onShareAppMessage: function () { 
        return {
            title: '大家一起画',
            desc: '你的好友邀请你来画画',
            path: '/pages/painter/painter'
        }
    },
    
    onLoad({ paintId }) {
        global_page = this
        GLOBAL_PAGE = this
        // context = wx.createContext()
        context_lancet = wx.createContext() 
        // const context = wx.createContext();//创建空白画布
    },

    save:function(){
        wx.canvasToTempFilePath({
            canvasId: 'paper',
            success: function success(res) {
                wx.showToast({
                    title: '导出图片成功',
                    icon: 'success',
                    duration: 2000
                })
                
                //上传云后台
                GLOBAL_PAGE.uploadFile(res.tempFilePath)

                //预览显示
                GLOBAL_PAGE.data.tempImage = res.tempFilePath
                console.log("save:",GLOBAL_PAGE.data.tempImage )

                wx.previewImage({
                    current: res.tempFilePath, // 当前显示图片的http链接
                    urls: [res.tempFilePath] // 需要预览的图片http链接列表
                })
            },
            complete: function complete(e) {

                console.log(e.errMsg);
            }
        });
    },
    saveToPlayer:function(){
        // GLOBAL_PAGE.save()
        GLOBAL_PAGE.navigateToPlayer()
        // var url = '../player/player'
        // wx.redirectTo({
        //     url: url
        // })  
    },


         //导航：播放器 
    navigateToPlayer: function(e) {
        var url = '../player/player?img_url=' + GLOBAL_PAGE.data.imgUpload
        var url = '../player/player?img_url=http://image.12xiong.top/1_20170118133253.png'
        wx.redirectTo({
            url: url
        })
    },
    // onReady: function (e) {
    // // //使用wx.createContext获取绘图上下文context
    // // var context = wx.createContext();
    //     context.beginPath()

    //     // context.stroke()
    //     context.setFillStyle ("#ff0000") ;
    //     context.setGlobalAlpha(0.4)
    //     // context.setStrokeStyle ("#ff0000") ;
    //     // context.setLineWidth (20)
    //     context.moveTo(160,100)
    //     context.lineTo(200,100)
    //     context.lineTo(200,200)
    //     context.lineTo(220,300)
    //     context.lineTo(230,210)

    // //     // context.arc(100,100,20,
    // //     // global_page.getAngle(100), global_page.getAngle(200),
    // //     //     true);  
    // //     // context.moveTo(140,100);  
    // //     // context.arc(100,100,40,0,Math.PI,false);  
    // //     // context.moveTo(85,80);  
    // //     // context.arc(80,80,5,0,2*Math.PI,true);  
    // //     // context.moveTo(125,80);  
    // //     // context.arc(120,80,5,0,2*Math.PI,true);  
    //     context.fill()
    // //     // context.stroke();  
    //     context.closePath()
    // //     //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    // //     wx.drawCanvas({
    // //     canvasId: "paper",
    // //     actions: context.getActions() //获取绘图动作数组
    // //     });
    // },



});








// save:function(){
//         wx.canvasToTempFilePath({
//             canvasId: 'paper',
//             success: function success(res) {
//                 wx.showToast({
//                     title: '成功',
//                     icon: 'success',
//                     duration: 2000
//                 })
//                 GLOBAL_PAGE.data.tempImage = res.tempFilePath
//                 console.log("save:",GLOBAL_PAGE.data.tempImage )
//                 wx.previewImage({
//                     current: res.tempFilePath, // 当前显示图片的http链接
//                     urls: [res.tempFilePath] // 需要预览的图片http链接列表
//                 })
//                 // wx.saveFile({
//                 //     tempFilePath: res.tempFilePath,
//                 //     success: function success(res) {
//                 //         console.log('saved::' + res.savedFilePath);
//                 //         GLOBAL_PAGE.data.tempImage = res.savedFilePath
//                 //         wx.previewImage({
//                 //             current: res.savedFilePath, // 当前显示图片的http链接
//                 //             urls: [res.savedFilePath] // 需要预览的图片http链接列表
//                 //         })
//                 //     },
//                 //     complete: function fail(e) {

//                 //         console.log(e.errMsg);
//                 //     }
//                 // });
//             },
//             complete: function complete(e) {
//                 // wx.showToast({
//                 //   title: '完成',
//                 //   icon: 'success',
//                 //   duration: 2000
//                 // })
//                 console.log(e.errMsg);
//             }
//         });