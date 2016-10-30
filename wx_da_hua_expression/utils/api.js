'use strict';

/* api.js  公共类
    小程序的api接口集合 
 */ 

var host_url = 'http://127.0.0.1:8000/wx_app/';

/*
	1、上传图片
	method:Post
	data: {imgData,imgType}
	success:{Token,imgUrl}
	faile:  
 */
var upload_img = 'upload/img/';
function _uploadImg(){
	return host_url+upload_img;
}

/*
	2、上传视频
	method:Post
	data: {videoData}
	success:{Token,imgUrl}
	faile:  
 */
var upload_video = 'upload/video/';
function _uploadVideo(){
	return host_url + upload_video;
}


/*
	3、图片打水印
	method:Post
	data: { watermarkData }
	success:{Token,imgUrl}
	faile:  
 */
var editorWatermark = 'editor/watermark/';
function _editorWatermark(){
	return host_url+editorWatermark;
}

/*
	4、图片+图片拼接
	method:Post
	data: { imgFirstUrl, imgSecondeUrl}
	success:{Token,imgUrl}
	faile:  
 */
var editorJoin = 'editor/join/';
function _editorJoin(){
	return host_url+editorJoin;
}

/*
	5、查私有图片
	method:Post
	data: { uId, imgParentId,imgId}
	success:{Token,imgUrlList}
	faile:  
 */
var get_picture_my = 'picture/my/';
function _getPictureMy(){
	return host_url+get_picture_my;
}

/*
	6、查公共热图
	method:Post
	data: { uId, imgParentId,imgId }
	success:{Token,imgUrlList}
	faile:  
 */
var get_picture_hot = 'picture/hot/';
function _getPictureHot(){
	return host_url+get_picture_hot;
}

/*
	7、添加目录
	method:Post
	data: { uId, categoryId,categoryParentId,name,isPublic }
	success:{Token}
	faile:  
 */
var add_category = 'category/add/';
function _addCategory(){
	return host_url+add_category;
}	

/*
	8、修改目录
	method:Post
	data: { uId, categoryId,categoryParentId,name,isPublic }
	success:{Token}
	faile:  
 */
var reset_category = 'category/reset/';
function _resetCategory(){
	return host_url+reset_category;
}	

/*
	9、删除目录
	method:Post
	data: { uId, categoryId }
	success:{Token}
	faile:  
 */
var delete_category = 'category/delete/';
function _deleteCategory(){
	return host_url+delete_category;
}	

/*
	10、查询目录
	method:Post
	data: { uId, categoryId }
	success:{Token}
	faile:  
 */
var query_category = 'category/query/';
function _queryCategory(){
	return host_url+query_category;
}	

/*
	11、添加用户
	method:Post
	data: { uuId, role,icon,name,isManage }
	success:{Token}
	faile:  
 */
var add_user = 'user/add/';
function _addUser(){
	return host_url+add_user;
}	


module.exports = {
	//上传接口
	uploadImg:_uploadImg,
	uploadVideo:_uploadVideo,

	//图片编辑接口
	editorWatermark:_editorWatermark,
	editorJoin:_editorJoin,

	//图片查询接口
	getPictureMy:_getPictureMy,
	getPictureHot:_getPictureHot,

	//Todo 表情收藏、删除
	//addPicture:_addPicture,
	//deletePicture:_deletePicture,
	
	//Todo 表情分类
	//addPictureCategory:_addPictureCategory

	//目录类别增、删、查、改接口
	addCategory:_addCategory,
	resetCategory:_resetCategory,
	deleteCategory:_deleteCategory,
	queryCategory:_queryCategory,
	
	//用户接口
	addUser:_addUser,
};



//encode编码- -！
// function _obj2uri(obj){
// 	return Object.keys(obj).map(function(k) {
// 		return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]);
// 	}).join('&');
// }
