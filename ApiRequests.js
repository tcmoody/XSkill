var request = require('request');
var url = "http://projectx-env.9ejcy7gdfj.us-west-2.elasticbeanstalk.com";
// var url = "http://localhost:3000"


var self = this;
var exports = module.exports = {};

exports.lookup = function (device_id , callback, doubleCallback){
  var path = "/api/lookup"
  var lookup_url = url + path + "?device_id=" + device_id;
  api_request(lookup_url, callback, doubleCallback));

exports.regcode = function  (device_id , callback){
  var path = "/api/regcode"
  var lookup_url = url + path + "?device_id=" + device_id;
  api_request(lookup_url, callback, doubleCallback));
}

exports.service = function (device_id , callback){
  var path = "/api/service"
  var lookup_url = url + path + "?device_id=" + device_id;
  api_request(lookup_url, callback, doubleCallback));
}

 function api_request(options, callback, doubleCallback)){
  request(options, function(error, response, body){
    if(error){
      console.log('Error', error);
      callback('error', doubleCallback));
    }
    if(response.statusCode == 200){
      callback(body, doubleCallback));
    }else{
      return console.log('Invalid Status Code: ', response.statusCode);
      callback('Error', doubleCallback));
    }
  });
}
