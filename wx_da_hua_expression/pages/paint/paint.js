Page({
    data: {
        //调色盘列表
        colors: ['#666666', '#FF0000', '#FFA500', 
        '#FFFF00', '#008000', '#0000FF', '#8A2BE2'],
        //选中的颜色
        paintColor: '#666666',
    },

    onLoad({ paintId }) {},

    chooseColor(event) {
        let paintColor = event.currentTarget.dataset.color;
        this.setData({ paintColor });
    },

    onTouchStart({ touches }) {
        const { clientX, clientY } = touches[0];
        this.movements = [[clientX, clientY]];
    },
    
    onTouchMove({ touches }) {
        const { clientX, clientY } = touches[0]; 
        this.movements.push([clientX, clientY]); //this.movements记录所有touch数据
        const [start, ...moves] = this.movements; 
        
        const context = wx.createContext();//创建空白画布
        context.save();
        context.moveTo(...start);
        moves.forEach(move => context.lineTo(...move)); //把所有touch数据连成一条线
        console.log(this.data.paintColor);
        context.setStrokeStyle(this.data.paintColor);
        context.setLineWidth(5);
        context.stroke();
        context.restore();

        this.lastActions = context.getActions();
        this.updateCanvas(this.lastActions);//更新画布，得出一条线
    },

    onTouchEnd() {},

    updateCanvas(actions) {
        wx.drawCanvas({ canvasId: 'paper', actions }); //wx自带绘图接口
    },
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