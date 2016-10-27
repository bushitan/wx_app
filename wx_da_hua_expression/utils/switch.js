// 页面隐藏开关
var HiddenSwitch = {
    page:"",
    view:{},
    Init:function(page,view){
      this.page = page
      this.view = view
    },
    //打开所有view
    OnAll:function(){
      for ( var i in this.view){
        this.view[i] = false
      }

    },
    //关闭所有view
    OffAll:function(){
      for ( var i in this.view){
        this.view[i] = true
      }
    },
    //仅打开当前view
    On:function(){
      for(var i in arguments)
        this.view[arguments[i]] = false
     
    },
    //仅关闭当前view
    Off:function( view ){
      for(var i in arguments)
        this.view[arguments[i]] = true
    },
    //关闭当前，打开全部
    OnAllExcept:function(view){
      for ( var i in this.view){
        this.view[i] = false
      }
      for(var i in arguments)
        this.view[arguments[i]] = true
    },
    //打开当前，关闭全部
    OffAllExcept:function(view){
      for ( var i in this.view){
        this.view[i] = true
      }
      for(var i in arguments)
        this.view[arguments[i]] = false
    },
    //Page执行显示/隐藏操作
    Work:function(){
      this.page.setData(this.view)
    }
}

module.exports = {
  View: HiddenSwitch
}
