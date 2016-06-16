var https = require('http');
var url = "http://projectx-env.9ejcy7gdfj.us-west-2.elasticbeanstalk.com";
// var url = "http://localhost:3000"


var self = this;
var exports = module.exports = {};

exports.lookup = function (device_id , callback){
  var path = "/api/lookup"
  var lookup_url = url + path + "?device_id=" + device_id;
  request(lookup_url, callback);
}

exports.regcode = function  (device_id , callback){
  var path = "/api/regcode"
  var lookup_url = url + path + "?device_id=" + device_id;
  request(lookup_url, callback);
}

exports.service = function (device_id , callback){
  var path = "/api/service"
  var lookup_url = url + path + "?device_id=" + device_id;
  request(lookup_url, callback);
}

function request(url, callback){
  https.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
      body += chunk;
    })

    res.on('end', function(){
      callback(body)
    });
  });

}
