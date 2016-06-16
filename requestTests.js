var api = require('./ApiRequests.js');


// looks up a user by device ID and sees if they are registered
// returns registration code if not registered 
api.lookup(1,callback);


//looks up a registration code by a device ID 
//returns a registration code
api.regcode(1,callback);

//adds a help request to the database 
//returns success 
api.service(1,callback);

//result is json returned from server
function callback(result){
//put code that deals with return from server here 
  console.log(result);
}
