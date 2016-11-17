//render.js   
//private 和 public 渲染页面


/** emoticonList 的元素内容
 * emoticonList[{ 
 *  img_id
 *  yun_url
 *  size 
 *  static_url  静止图
 *  thumbnail_url  缩略图
 * }]
 */
function emoticon(page,emoticon){
    if (emoticon){
        var _list = emoticon //浅拷贝，最好深拷
        for (var i=0;i<_list.length;i++)
        {
            var _size =  _list[i]["size"]
            _list[i]["static_url"] = _list[i]["yun_url"] + "?imageMogr2/thumbnail/96x96/format/jpg" 
            _list[i]["thumbnail_url"] = _list[i]["yun_url"] + "?imageMogr2/thumbnail/"+_size+"x"+_size  
        }
        page.setData({emoticon:_list})
    }
    
    //Todo 增加多种数据
}

/** categoryList 的元素内容
 * category_list[{ 
 *  name  名字
 * }]
 */
function category(page, categoryList){
    page.setData({category:categoryList})
}



module.exports = {
    emoticon:emoticon,
    category:category,
}