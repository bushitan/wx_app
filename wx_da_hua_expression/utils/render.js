//render.js   
//private 和 public 渲染页面
//  G240:2,
//     G180:3, 
//     G124:4,  
//     G96:5,
var MENU_TYPE = {
    SQUARE:1, //小方块
    VERTICAL:2,  // 竖直 vertical
    HORIZONTAL:3, //横向
} 

// function (){}
//  size 对应 缩略 
//  var size = {
//      1:'原图',
//      2:180,
//      3：124,
//      4:96,
//  } 

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
            //静态压缩图
            _list[i]["static_url"] = _list[i]["yun_url"] + "?imageMogr2/thumbnail/96x96/format/jpg" 

            //Todo 根据size 拿缩略图
            var _size =  _list[i]["size"]
            var thumbnail_url = ''
            switch(_size){
                case 170:
                 _list[i]["thumbnail_url"]  = _list[i]["yun_url"] + "?imageMogr2/thumbnail/"+_size+"x"+_size
                 _list[i]["menu_type"] =  MENU_TYPE.SQUARE
                 break;
                case 2:   //竖图
                _list[i]["thumbnail_url"]  = _list[i]["yun_url"] ;
                _list[i]["menu_type"] =  MENU_TYPE.VERTICAL
                break;
                case 3:   //横图
                _list[i]["thumbnail_url"]  = _list[i]["yun_url"] ;
                _list[i]["menu_type"] =  MENU_TYPE.HORIZONTAL
                break;
                // case 3:break;
                // case 4:break;
            }

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
    MENU_TYPE:MENU_TYPE,
    emoticon:emoticon,
    category:category,
}