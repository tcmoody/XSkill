var https = require('http');
// var url = "http://www.callmyguardian.com";
var url = "http://localhost:3000"


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

exports.lookup = function (device_id , callback, doubleCallback){
  var path = "/api/lookup"
  var lookup_url = url + path + "?device_id=" + device_id;
  request(lookup_url, callback, doubleCallback);
}

exports.regcode = function  (device_id , callback, doubleCallback){
  var path = "/api/regcode"
  var lookup_url = url + path + "?device_id=" + device_id;
  request(lookup_url, callback, doubleCallback);
}

exports.service = function (device_id , message,  callback, doubleCallback){
  var path = "/api/service"
  var lookup_url = url + path + "?device_id=" + device_id + "&message=" + encodeURIComponent(message);
  request(lookup_url, callback, doubleCallback);
}

function request(url, callback, doubleCallback){
  https.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
      body += chunk;
    })

    res.on('end', function(){
      callback(body, doubleCallback)
    });
  });

}
