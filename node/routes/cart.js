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

//查询购物车内所有商品
router.get("/cartuser", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	MySql.connect((err)=>{
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findSortData(db,"cart",{"userID":userID},{},{time:-1},(result) => {
	     	res.send(result)
	      db.close();
     	}) 
   	})
})

//添加购物车
router.post("/addcart", (req, res, next) =>{
	var obj=req.body;
	console.log(obj.tradeItemId)
	obj.Isflag=true;
	MySql.connect((err)=>{
	 console.log(err)
	 res.send("0")
 },(db)=>{
 			MySql.findData(db,"cart",{"userID":obj.userID,"tradeItemId":obj.tradeItemId,"size":obj.size},{},(result) => {
      if(result.length==0){
      	MySql.insert(db, "cart", obj ,(result) => {
	        res.send("1") 
	        db.close();
	      })
      }else{
      	var newnum=result[0].num*1+obj.num*1;
      	 MySql.upData(db, "cart", {"userID":obj.userID,"tradeItemId":obj.tradeItemId,"size":obj.size} , {$set:{time:obj.time,num:newnum}} ,(result) => {
	        res.send("1") 
	        db.close();
	      })
      }
       db.close();
     })
    })
  })

//更新购物车状态
router.get("/updatecart", (req, res, next) =>{
	var query=url.parse(req.url,true).query;
	var userID=query.userID;
	var tradeItemId=query.tradeItemId;
	var size=query.size;
  MySql.connect((err)=>{
     console.log(err)
      res.send("0") 
   },(db)=>{
   	MySql.findData(db,"cart",{"userID":userID,"tradeItemId":tradeItemId,"size":size},{Isflag:1},(result) => {
      var Isflag=!result[0].Isflag
		  MySql.upData(db, "cart", {"userID":userID,"tradeItemId":tradeItemId,"size":size} , {$set:{"Isflag":Isflag}} ,(result) => {
		       res.send("1")
		        db.close();
		      })
       db.close();
     })
   })
})

//删除一件商品
router.get("/removecart", (req, res, next) =>{
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

//删除多件商品
router.get("/removeallcart", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
  MySql.connect((err)=>{
     console.log(err)
     res.send("0") 
  },(db)=>{
				  MySql.deleteManyData(db, "cart", {"userID":userID,"isFlag":true} ,(result) => {
				        res.send("1") 
				        db.close();
				     })
   })
})



module.exports = router;
