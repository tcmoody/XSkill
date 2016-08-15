var https = require('http');
var url = "www.callmyguardian.com";
// var url = "localhost"


/**
 How to use these Functions
 in another file
 var api = require('./ApiRequests.js')

 in an intent function such as 'function getRegistrationCode(intent, session, callback)'

 api.regcode(session.user.userId, registrationCodeCallback, callback);

 function registrationCodeCallback(result, callback)

 result is raw string and will need to be converted to json
 do what ever needs to be done with the result

 the callback function is the same callback that was getting used by welcomeResponse

 callback(sessionAttributes,
     buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

*/

var self = this;
var exports = module.exports = {};
var querystring = require('querystring');

exports.lookup = function (device_id , callback, doubleCallback){
  var path = "/api/lookup"

  var post_data = {
    'device_id' : device_id
  }

  request(path, post_data, callback, doubleCallback);
}

exports.regcode = function  (device_id , callback, doubleCallback){
  var path = "/api/regcode"

  var post_data = {
    'device_id' : device_id
  }

  request(path, post_data, callback, doubleCallback);
}

exports.service = function (device_id , message,  callback, doubleCallback){
  var path = "/api/service"

  var post_data = {
    'device_id' : device_id,
    'message' : message
  }

  request(path, post_data, callback, doubleCallback);
}

function request(request_path, post_data, callback, doubleCallback){

  var post_options = {
    host: url,
    path: request_path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  }

  https.request(post_options, function(res){
    var body = '';

    res.on('data', function(chunk){
      body += chunk;
    })

    res.on('end', function(){
      callback(body, doubleCallback)
    });
  });

}
