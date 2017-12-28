var express = require('express');
var router = express.Router();
var http = require("http")
var multer = require("multer");
var url = require("url");
var md5 = require('md5')
var MySql = require("./../md/MySql.js")
var myTool = require("./../md/myTool.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//用户注册
router.get("/register", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	var password=md5(url.parse(req.url,true).query.password);
	var registerdate=new Date().getTime();
	MySql.connect((err)=>{
		res.send("2")
	  console.log(err)
	 },(db)=>{
	     MySql.findData(db,"userlist",{"userID":userID},{_id:0,userID:1},(result) => {
	     	if(result.length==0){
	     		  MySql.insert(db,"userlist",{"userID":userID,"password":password,"registerdate":registerdate,"lastdate":registerdate,"isLogin":true,"address":[]},(result) => {
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

//用户登录
router.get("/login", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	var password=md5(url.parse(req.url,true).query.password);
	var lastdate=new Date().getTime();
	MySql.connect((err)=>{
		res.send("3")
	  console.log(err)
	 },(db)=>{
	     MySql.findData(db,"userlist",{"userID":userID},{_id:0,userID:1,password:1},(result) => {
	     if(result.length==0){
	     		  res.send("0")
	     	}else{
	     		if(result[0].password==password){
	     			 MySql.upData(db,"userlist",{"userID":userID},{$set:{"lastdate":lastdate,"isLogin":true}},(result) => {
				       res.send(userID)
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


//用户地址添加
router.get("/addUserInfo", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	var address=JSON.parse(url.parse(req.url,true).query.address);
	
	MySql.connect((err)=>{
		res.send("0")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"userlist",{"userID":userID},{_id:0,address:1},(result) => {
			if(result[0].address.length==0){
				address.normal="block"
			}else{
				address.normal="none"
			}
	    result[0].address.push(address);
			var newarr=result[0].address;
		  MySql.upData(db,"userlist",{"userID":userID},{$set:{address:newarr}},(result) => {
			       res.send("1")
			       db.close();
		     	})
	       db.close();
     	}) 
   	})
})

//用户地址查询
router.get("/userAddress", (req, res, next) =>{
	var userID=url.parse(req.url,true).query.userID;
	MySql.connect((err)=>{
		res.send("2")
	  console.log(err)
	},(db)=>{
	     MySql.findData(db,"userlist",{"userID":userID},{_id:0,address:1},(result) => {
	     	if(result.length==0){
	       res.send("0")
	     	}else{
	     		res.send(result[0])
	     	}
	       db.close();
     	}) 
   	})
})


//短信验证码
function getRandom(){
		var num=""
		for(i=0;i<6;i++){
			num+=Math.floor(Math.random()*10)
		}
		return num;
}
var num=getRandom()
  //hySendMsg(mobile, code, failCallBack, successCallBack){
router.get('/sendMsg', function(req, res, next) {
  var mobile = url.parse(req.url,true).query.mobile;
	myTool.hySendMsg(mobile,num,(msg) => {
	  res.send("0");
	},() =>{
	  //成功
	  res.send({"mobile":mobile,"num":num});
	})
});

//免密登录
router.get("/nopasslogin", (req, res, next) =>{
	var phone=url.parse(req.url,true).query.phone;
	var time=new Date().getTime();
	MySql.connect((err)=>{
		res.send("2")
	  console.log(err)
	 },(db)=>{
	console.log(phone)
	     MySql.findData(db,"userlist",{"phone":phone},{_id:0,userID:1},(result) => {
	     	var info=result[0];
	     	if(result.length==0){
	     		  MySql.insert(db,"userlist",{"userID":phone,"phone":phone,"registerdate":time,"lastdate":time,"isLogin":true,address:[]},(result) => {
				       res.send(phone)
				       db.close();
				     })
	     	}else{
	     		 MySql.upData(db,"userlist",{"phone":phone},{$set:{"lastdate":time,"isLogin":true}},(result) => {
			       res.send(info.userID)
			       db.close();
		     	}) 
	     	}
	       db.close();
	     })
   	})
})
module.exports = router;
