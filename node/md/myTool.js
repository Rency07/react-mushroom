var https = require('https');
var http = require('http');
var IHuyi = require("ihuyi106");
module.exports = {
  httpRequest(options, res){
      var reqResult = http.request(options, (result) => {
        var str = "";
        result.on('data', (val) => {
          str += val;
        })
        result.on('end', () =>{
//        console.log(str);
          res.send(str)
        })
      })
      reqResult.on('error', function(err){
        console.log(err)
      })
      reqResult.end();
  },
  httpsRequest(options, res){
      var reqResult = https.request(options, (result) => {
        var str = "";
        result.on('data', (val) => {
          str += val;
        })
        result.on('end', () =>{
//        console.log(str);
          res.send(str)
        })
      })
      reqResult.on('error', function(err){
        console.log(err)
      })
      reqResult.end();
  },
  /*
   * 互亿无线发送短信
   * cnpm install ihuyi106 -S
   */
  hySendMsg(mobile, code, failCallBack, successCallBack){
    
    var account = "C06675055"; //对应APIID
    var password = "882a6957541152bcbc455bb34161f54d";//APIKEY
    var mobile = mobile;
    var content = "您的验证码是："+code+"。请不要把验证码泄露给其他人。";//短信模板内容
    
    var iHuyi = new IHuyi(account, password);
    iHuyi.send(mobile, content, function(err, smsId) {
        if(err) {
            console.log(err.message);
            failCallBack(err.message);
        } else {
            console.log("发送成功");
            successCallBack();
        }
    });
  }
 
}
