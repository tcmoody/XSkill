var api = require('./ApiRequests.js');



api.lookup(1,callback);

api.regcode(1,callback);

api.service(1,callback);


function callback(result){

  console.log(result);
}
