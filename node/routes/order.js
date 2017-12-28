var express = require('express');
var router = express.Router();
var http = require("http")
var multer = require("multer");
var url = require("url");
var MySql = require("./../md/MySql.js")
var myTool = require("./../md/myTool.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//查询某用户某种订单
router.get("/orderuser", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	var type=url.parse(req.url,true).query.type;
	if(type=="all"){
		obj={"userID":userID}
	}else{
		obj={"userID":userID,"type":type}
	}
	MySql.connect((err)=>{ 
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findSortData(db,"order",obj,{_id:0},{time:-1},(result) => {
	     	res.send(result)
	      db.close();
     	}) 
   	})
})

//查询某用户单个订单
router.get("/orderid", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	var tradeItemId=url.parse(req.url,true).query.tradeItemId;
	var size=url.parse(req.url,true).query.size;
	var time=url.parse(req.url,true).query.time;
	MySql.connect((err)=>{ 
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"order",{"userID":userID,"tradeItemId":tradeItemId,"size":size,"time":time},{},(result) => {
	     	res.send(result)
	      db.close();
     	}) 
   	})
})
//添加订单
router.post("/addorder", (req, res, next) =>{
var obj=req.body;
	MySql.connect((err)=>{
	 console.log(err)
	 res.send("0")
 },(db)=>{
      	MySql.insert(db, "order", obj ,(result) => {
	        res.send("1") 
	        db.close();
	      })
    })
 })


//更新订单状态
router.get("/updatecart", (req, res, next) =>{
	var query=url.parse(req.url,true).query;
	var userID=query.userID;
	var tradeItemId=query.tradeItemId;
	var size=query.size;
	var type=query.type;
  MySql.connect((err)=>{
     console.log(err)
      res.send("0") 
   },(db)=>{
	  MySql.upData(db, "cart", {"userID":userID,"tradeItemId":tradeItemId,"size":size,"time":time} , {$set:{"type":type}} ,(result) => {
	        res.send("1") 
	        db.close();
	      })
   })
})

//删除一件订单
router.get("/removeorder", (req, res, next) =>{
	var query=url.parse(req.url,true).query;
	var userID=query.userID;
	var tradeItemId=query.tradeItemId;
	var size=query.size;
  MySql.connect((err)=>{
     console.log(err)
     res.send("0") 
   },(db)=>{
	  MySql.deleteOneData(db, "cart", {"userID":userID,"tradeItemId":tradeItemId,"size":size} ,(result) => {
	        res.send("1") 
	        db.close();
	      })
   })
})



module.exports = router;
