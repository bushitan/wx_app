//render.js   
//private 和 public 渲染页面


/**
 * emoticon{ 
 *  img_id
 *  yun_url
 *  size 
 *  static_url  静止图
 *  thumbnail_url  缩略图
 * } 
 */
function emoticon(page,emoticonList){
    var _list = emoticonList //浅拷贝，最好深拷

    for (var i=0;i<_list.length;i++)
    {
        var _size =  _list[i]["size"]
        _list[i]["static_url"] = _list[i]["yun_url"] + "?imageMogr2/thumbnail/96x96/format/jpg" 
        _list[i]["thumbnail_url"] = _list[i]["yun_url"] + "?imageMogr2/thumbnail/"+_size+"x"+_size  
    }
    
    page.setData({emoticonList:_list})
    //Todo 增加多种数据
}

function category(){}

module.exports = {
    emoticon:emoticon,
    category:category,
}