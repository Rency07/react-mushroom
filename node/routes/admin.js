var express = require('express');
var router = express.Router();
var http = require("http")
var fs = require("fs");
var qs = require("qs");
var multer = require("multer");
var url = require("url");
var md5 = require('md5')
var MySql = require("./../md/MySql.js")
var myTool = require("./../md/myTool.js");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, "./public/images")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)  //--- 原来文件的名字
  }
})
var addimg = multer({ storage: storage })
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//管理员注册
router.get("/register", (req, res, next) =>{
	var adminID=url.parse(req.url,true).query.adminID;
	var password=md5(url.parse(req.url,true).query.password);
	var registerdate=new Date().getTime();
	MySql.connect((err)=>{
		res.send("2")
	  console.log(err)
	 },(db)=>{
	     MySql.findData(db,"admin",{"adminID":adminID},{_id:0,adminID:1},(result) => {
	     	if(result.length==0){
	     		  MySql.insert(db,"admin",{"adminID":adminID,"password":password,"registerdate":registerdate,"lastdate":registerdate},(result) => {
				       res.send("1")
				       db.close();
				     })
	     	}else{
	     		res.send("0")
	     	}
	       db.close();
	     })
   	})
})

//管理员登录
router.get("/login", (req, res, next) =>{
	var adminID=url.parse(req.url,true).query.adminID;
	var password=md5(url.parse(req.url,true).query.password);
	var lastdate=new Date().getTime();
	MySql.connect((err)=>{
	  console.log(err)
	 },(db)=>{
	     MySql.findData(db,"admin",{"adminID":adminID},{_id:0,adminID:1,password:1},(result) => {
	     if(result.length==0){
	     		  res.send("0")
	     	}else{
	     		if(result[0].password==password){
	     			 MySql.upData(db,"admin",{"adminID":adminID},{$set:{"lastdate":lastdate}},(result) => {
				       res.send("1")
				       db.close();
			     	})
	     		}else{
	     			res.send("2")
	     		}
	     	}
	       db.close();
	     })
   	})
})


//查询用户列表
router.get("/userlist", (req, res, next) =>{
	var start=url.parse(req.url,true).query.start;
	var num=url.parse(req.url,true).query.num;
  MySql.connect((err)=>{
  	res.send("0")
     console.log(err)
   },(db)=>{
     MySql.findPagingData(db,"userlist",{},{_id:0,password:0},(start*1-1),(num*1),(result) => {
       res.send(result)
       db.close();
     })
   })
})


//用户个人信息查询
router.get("/userInfo", (req, res, next) =>{
	var userID=eval("/"+url.parse(req.url,true).query.userID+"/");
	MySql.connect((err)=>{
		res.send("2")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"userlist",{"userID":userID},{_id:0,password:0},(result) => {
	     	if(result.length==0){
	       res.send("0")
	     	}else{
	     		res.send(result)
	     	}
	       db.close();
     	}) 
   	})
})

//商家列表查询
router.get("/shoplist", (req, res, next) =>{
  MySql.connect((err)=>{
     console.log(err)
     	res.send("0") 
  },(db)=>{
     MySql.findSimpleData(db,"detail","shopSeller",(result) => {
     	res.send(result) 
       db.close();
     })
   })
})

//商家产品查询
router.get("/shopdetail", (req, res, next) =>{
	var shopSeller=url.parse(req.url,true).query.shopSeller;
  MySql.connect((err)=>{
     console.log(err)
     	res.send("0") 
  },(db)=>{
      MySql.findData(db,"detail",{"shopSeller":shopSeller},{_id:0},(result) => {
      	var arr=[];
      	for(var i in result){
      		for(var j in arr){
      			if(result[i].tradeItemId==arr[j].tradeItemId){
      				arr.push(result[i])
      			}
      		}
      	}
     		res.send(result) 
       db.close();
     })
   })
})

//获取banner列表
router.get('/bannerList', function(req, res, next) {
  MySql.connect((err) => {
    console.log(err)
    res.send("0")
  }, (db) => {
     MySql.findData(db, "homebanner", {}, {_id:0}, (result) => {
       res.send(result);
       db.close();
     })
  })
});

//删除banner图
router.get("/removebanner", (req, res, next) =>{
  var title = url.parse(req.url, true).query.title;
  MySql.connect((err) => {
    console.log(err)
    res.send("0")
  }, (db) => {
     MySql.deleteOneData(db, "homebanner", {"title":title}, (result) => {
     	res.send("1")
       db.close();
     })
  })
})


//改变banner图可用性
router.get("/changebanner", (req, res, next) =>{
  var title = url.parse(req.url, true).query.title;
  var isUse = url.parse(req.url, true).query.isUse;
  MySql.connect((err) => {
    console.log(err)
    res.send("0")
  }, (db) => {
     MySql.upData(db, "homebanner", {"title":title}, {$set:{"isUse":isUse}},(result) => {
     	res.send("1")
       db.close();
     })
  })
})

//增加banner图
router.post("/addbanner", addimg.single('img'),(req, res, next) =>{
	var title=req.body.title;
	var position=req.body.position;

  MySql.connect((err) => {
        console.log(err)
        res.send("0");
      }, (db) => {
           var obj = {
             title: title,
             position: position,
             image:"http://"+req.headers.host + '/images/' + req.file.originalname,
             isUse: 1
           }
           MySql.insert(db, "homebanner", obj, (results) => {
              res.send("1");
              db.close();
           })
         
      })
})



//获取首页产品列表
router.get('/homesaleList', function(req, res, next) {
  MySql.connect((err) => {
    console.log(err)
    res.send("0")
  }, (db) => {
     MySql.findData(db, "homesale", {}, {_id:0}, (result) => {
       res.send(result);
       db.close();
     })
  })
});

//删除首页产品
router.get("/removehomesale", (req, res, next) =>{
  var tradeItemId = url.parse(req.url, true).query.tradeItemId;
  MySql.connect((err) => {
    console.log(err)
    res.send("0")
  }, (db) => {
     MySql.deleteOneData(db, "homesale", {"tradeItemId":tradeItemId}, (result) => {
     	res.send("1")
       db.close();
     })
  })
})


//增加首页产品 
router.post("/addhomesale", addimg.single('proimg'),(req, res, next) =>{
	var title=req.body.title;
	var tradeItemId=req.body.tradeItemId;
	var props=req.body.props.split(",");
	var sale=req.body.sale;
	var cfav=req.body.cfav;
	var price=req.body.price;
	var orgPrice=req.body.orgPrice;
  
  
  MySql.connect((err) => {
        console.log(err)
        res.send("0");
      }, (db) => {
           var obj = {
             title: title,
             tradeItemId: tradeItemId,
             iid:tradeItemId,
             props:props,
             sale:sale,
             cfav:cfav,
             price:price,
             orgPrice:orgPrice,
             img:"http://"+req.headers.host + '/images/' + req.file.originalname,
             isUse: 1
           }
           MySql.insert(db, "homesale", obj, (results) => {
              res.send("1");
              db.close();
           })
         
      })  
})
module.exports = router;
