var globl_page
var context
Page({
    data: {
        //调色盘列表
        colors: ['#666666', '#FF0000', '#FFA500', 
        '#FFFF00', '#008000', '#0000FF', '#ffffff'],
        //选中的颜色
        paintColor: '#666666',
        context:"",
    },

    save(){
        // var src = wx.canvasToTempFilePath({ canvasId: 'paper'})
        // console.log(src)
        wx.toTempFilePath({
            canvasId: 'paper',
            success: function (res) {
                console.log(res)
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    onLoad({ paintId }) {
        globl_page = this
        context = wx.createContext()
        // const context = wx.createContext();//创建空白画布
    },

    chooseColor(event) {
        let paintColor = event.currentTarget.dataset.color;
        this.setData({ paintColor });
    },

    onTouchStart({ touches }) {
        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];

        this.startX = clientX
        this.startY = clientY
        this.movements = [clientX, clientY];


       
       
    },
    
    onTouchMove({ touches }) {
        const  clientX = touches[0]['x'];
        const  clientY = touches[0]['y'];
       
        //仿画吧，柳叶刀
        // context.beginPath()
        // context.setFillStyle (this.data.paintColor) ;
        // context.setStrokeStyle (this.data.paintColor) ;
        // context.setLineWidth (2)
        // context.moveTo(this.startX,this.startY)
        // context.lineTo(this.movements[0],this.movements[1])
        // context.lineTo(clientX,clientY)
        // context.setLineCap("round")
        // context.setLineJoin("miter")
        // context.setMiterLimit(10)
        // context.fill()
        // context.stroke();  
        // context.closePath()
        // this.movements = [clientX, clientY];

        //平滑画笔
        context.beginPath()
        context.setStrokeStyle (this.data.paintColor) ;
        context.setLineWidth (2)
        context.moveTo(this.movements[0],this.movements[1])
        context.lineTo(clientX,clientY)
        context.stroke(); 
        context.closePath()
        this.movements = [clientX, clientY];



        this.lastActions = context.getActions();
        this.updateCanvas(this.lastActions);//更新画布，得出一条线
    },

    onTouchEnd() {
        // context.closePath()
    },
   
    getAngle(arc) {  
        return Math.PI * (arc / 180);  
    } , 
    updateCanvas(actions) {
        // console.log(actions)
        wx.drawCanvas({ canvasId: 'paper', actions,reserve:"true" }); //wx自带绘图接口
    },


    canvasIdErrorCallback: function (e) {
        console.error(e.detail.errMsg);
    },
    // onReady: function (e) {
    // //使用wx.createContext获取绘图上下文context
    // var context = wx.createContext();
    //     context.beginPath()

    //     // context.stroke()
    //     context.setFillStyle ("#ff0000") ;
    //     // context.setStrokeStyle ("#ff0000") ;
    //     // context.setLineWidth (20)
    //     context.moveTo(160,100)
    //     context.lineTo(200,100)
    //     context.lineTo(200,200)
    //     context.lineTo(220,300)
    //     context.lineTo(230,210)

    //     // context.arc(100,100,20,
    //     // globl_page.getAngle(100), globl_page.getAngle(200),
    //     //     true);  
    //     // context.moveTo(140,100);  
    //     // context.arc(100,100,40,0,Math.PI,false);  
    //     // context.moveTo(85,80);  
    //     // context.arc(80,80,5,0,2*Math.PI,true);  
    //     // context.moveTo(125,80);  
    //     // context.arc(120,80,5,0,2*Math.PI,true);  
    //     context.fill()
    //     // context.stroke();  
    //     context.closePath()
    //     //调用wx.drawCanvas，通过canvasId指定在哪张画布上绘制，通过actions指定绘制行为
    //     wx.drawCanvas({
    //     canvasId: "paper",
    //     actions: context.getActions() //获取绘图动作数组
    //     });
    // },



});





    //[start, ...moves] 
    //http://www.jdon.com/idea/js/ecmascript-rest-spread.html

    // (x) => x + 6
    // 相当于
    // function(x){
    //     return x + 6;
    // }

    //let 允许把变量的作用域限制在块级域中。
    //与 var 不同处是：var 申明变量要么是全局的，要么是函数级的，而无法是块级的
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let

    
    //const 声明创建一个只读的常量。这不意味着常量指向的值不可变，而是变量标识符的值只能赋值一次。
    //JavaScript中的常量和Java，C++中的常量一个意思。注意区分常量的值和常量指向的值的不同
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/const









    //  onTouchStart({ touches }) {
    //     const  clientX = touches[0]['x'];
    //     const  clientY = touches[0]['y'];
    //     this.movements = [clientX, clientY];
        
    //     // context.beginPath()
    //     // context.moveTo(this.movements[0],this.movements[1]);
    // },
    
    // onTouchMove({ touches }) {
    //     // const { clientX, clientY } = touches[0]; 
    //     const  clientX = touches[0]['x'];
    //     const  clientY = touches[0]['y'];
    //     // this.movements.push([clientX, clientY]); //this.movements记录所有touch数据
    //     const [start, ...moves] = this.movements; 
        
    //     // context = globl_page.data.context
    //     // context.save();

        

    //     context.moveTo(this.movements[0],this.movements[1]);
    //     context.lineTo(clientX,clientY);
    //     console.log(this.data.paintColor);
    //     context.setStrokeStyle(this.data.paintColor);
    //     context.setLineWidth(5);
    //     context.setLineCap("round")
    //     context.stroke();
    //     context.restore();
        
        

        
        
    //     this.movements = [clientX, clientY];
    //     this.lastActions = context.getActions();
    //     this.updateCanvas(this.lastActions);//更新画布，得出一条线
    // },

    // onTouchEnd() {
        
    // },
   