import fetchJsonp  from 'fetch-jsonp'
import axios from 'axios'
import $ from 'jquery'
var MyAjax = {
      jquery:function(url, callback){
        $.ajax({
          type:"get",
          url:url,
          success:function(data){
            callback(data);
          }
        });
      },
       jquerypost:function(url, body,callback){
        $.ajax({
          type:"post",
           mode: "cors",
          url:url,
          date:body,
          success:function(data){
            callback(data);
          }
        });
      },
      jqueryJsonp:function(url,data,callback){
        $.ajax({
          type:"get",
          url:url,
          data:data,
          dataType:"jsonp",
          success:function(data){
            callback(data);
          }
        });
      },
      fetch(url, callback){
        fetch(url).then(function(response) {
          return response.json();
        }).then(function(data) {
          callback(data);
        }).catch(function(e) {
          console.log("Oops, error");
        });
      },
      fetchpost(url,body,callback){
			  fetch(url, {
				  method: 'POST',
				  header:{ "Content-Type": "application/x-www-form-urlencoded"},
				  body:body
				}).then(function(response) {
          return response.json();
        }).then(function(data) {
          callback(data);
        }).catch(function(e) {
          console.log("Oops, error");
        });
      },
      fetchJsonp(url, callback){
        fetchJsonp(url).then(function(response) {
          return response.json();
        }).then(function(data) {
          callback(data);
        }).catch(function(e) {
          console.log("Oops, error");
        });
      }
    },
		  axios(url, obj, callback){
			  axios(url,  obj).then((response) => {
			    callback(response.data)
			  }).catch((error) => {
			    console.log(error)
			  }
			 }
  }
export default MyAjax;
