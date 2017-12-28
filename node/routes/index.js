var express = require('express');
var router = express.Router();
var http = require("http")
var multer = require("multer");
var url = require("url");
var md5 = require('md5')
var MySql = require("./../md/MySql.js")
var myTool = require("./../md/myTool.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//首页轮播图查询
router.get("/banner", (req, res, next) =>{
	var position=url.parse(req.url,true).query.position;
	MySql.connect((err)=>{
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"homebanner",{"position":position,isUse:1},{_id:0},(result) => {
	     	res.send(result)
	      db.close();
     	}) 
   	})
})

//分类侧边栏查询
router.get("/kindaside", (req, res, next) =>{
	MySql.connect((err)=>{
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"kindasidelist",{},{_id:0,list:0},(result) => {
	     	res.send(result)
	      db.close();
     	}) 
   	})
})

//分类右侧内容查询
router.get("/kindnext", (req, res, next) =>{
	var title=url.parse(req.url,true).query.title;
	console.log(title)
	MySql.connect((err)=>{
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"kindasidelist",{"title":title},{_id:0},(result) => {
	     	res.send(result[0])
	      db.close();
     	}) 
   	})
})

//查询某张表全部数据
router.get("/collection", (req, res, next) =>{
	var collection=url.parse(req.url,true).query.collection;
	MySql.connect((err)=>{
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,collection,{},{_id:0},(result) => {
	     	res.send(result)
	      db.close();
     	}) 
   	})
})


//分页查询某个表内元素
router.get("/listpage", (req, res, next) =>{
	var collection=url.parse(req.url,true).query.collection;
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findPagingData(db,collection,{},{_id:0},(start*1-1),(num*1),(result) => {
       res.send(result)
       db.close();
     })
   })
})

//分页查询分类元素
router.get("/kindpage", (req, res, next) =>{
	var type=url.parse(req.url,true).query.type;
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findData(db,"kindnextlist",{"type":type},{_id:0},(result) => {
     	if(result.length==0){
     		res.send("2")
     	}else{	
	       res.send(result[0].list.slice(start*num,(start*1+1)*num))
     	}
       db.close();
     })
   })
})

/*//分页按销量查询分类元素
router.get("/kindpage", (req, res, next) =>{
	var type=url.parse(req.url,true).query.type;
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findData(db,"kindnextlist",{"type":type},{_id:0},(result) => {
     	if(result.length==0){
     		res.send("2")
     	}else{	
	       res.send(result[0].list.slice(start*num,(start*1+1)*num))
     	}
       db.close();
     })
   })
})

//分页查询分类元素
router.get("/kindpage", (req, res, next) =>{
	var type=url.parse(req.url,true).query.type;
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findData(db,"kindnextlist",{"type":type},{_id:0},(result) => {
     	if(result.length==0){
     		res.send("2")
     	}else{	
	       res.send(result[0].list.slice(start*num,(start*1+1)*num))
     	}
       db.close();
     })
   })
})

//分页查询分类元素
router.get("/kindpage", (req, res, next) =>{
	var type=url.parse(req.url,true).query.type;
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findData(db,"kindnextlist",{"type":type},{_id:0},(result) => {
     	if(result.length==0){
     		res.send("2")
     	}else{	
	       res.send(result[0].list.slice(start*num,(start*1+1)*num))
     	}
       db.close();
     })
   })
})*/

//分页搜索
router.get("/search", (req, res, next) =>{
	var type=eval("/"+decodeURI(url.parse(req.url,true).query.type)+"/");
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
	obj={"title":type};
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findPagingData(db,"detail",obj,{_id:0},(start*1),(num*1),(result) => {
     	if(result.length==0){
     		res.send("2")
     	}else{	
	       res.send(result)
     	}
       db.close();
     })
   })
})


//详情
router.get("/detail", (req, res, next) =>{
	var tradeItemId=url.parse(req.url,true).query.tradeItemId;
  MySql.connect((err)=>{
  	res.send("2")
     console.log(err)
   },(db)=>{
     MySql.findData(db,"detail",{"tradeItemId":tradeItemId},{_id:0},(result) => {
     	if(result.length==0){
     		res.send("0")
     	}else{
	     	res.send(result[0])
     	}
       db.close();
     })
   })
})

 
/*router.get("/mmmm", (req, res, next) =>{
  MySql.connect((err)=>{
     console.log(err)
   },(db)=>{
			MySql.upData(db, "homesale", {}, {$set:{"isUse":1}},(result) => {
     	res.send("1")
       db.close();
     })
   })
})
*/

module.exports = router;
