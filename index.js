var api = require('./ApiRequests.js');
var app_id = "";

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        //Only allow this skill to use the lambda function
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.0e672e82-bdf7-410c-bce4-cb65e98ab72f") {
             context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 * logs session
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback, session);
}

/**
 * Called when the user specifies an intent for this skill.
 * This does all the intent routing
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if("GetRegistrationCodeIntent" === intentName){
        getRegistrationCode(intent, session, callback);
    }else if("GetHelpIntent" === intentName){
      getWelcomeResponse(callback, session);
    }else if ("AMAZON.HelpIntent" === intentName) {
      //CHANGE THIS SHOULD PROBABLY CALL GET REGISTRATION CODE
        getWelcomeResponse(callback, session);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
}



/**
* This makes a call to the api to request help
*/
function getWelcomeResponse(callback, session){
 api.service(session.user.userId, welcomeCallback, callback);
}

// This handles the return from the api call
function welcomeCallback(result, callback){
  var sessionAttributes = {};
  var cardTitle = "Welcome";
  var speechOutput = "your request for help has been processed";
  var repromptText = ""
  var shouldEndSession = false;

  var resJson = JSON.parse(result);
  // Call for help suceeded
  if(resJson.message == 'request processed'){
      callback(sessionAttributes,
          buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }
  // This happens if you try to register the same device twice
  else if(resJson.message == 'user exists'){
     speechOutput = "This device is already registered to a user";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }
  // Response if user had no caregivers registered
  else if(resJson.message == 'no careivers registered'){
     speechOutput = "We could not process your request because you have no caregivers associated with your account";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }
  // This handles all server errors
  else if(resJson.sucess == 'false'){
     speechOutput = "We are currently experiencing trouble. Please try again";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }
  // If the device is not regsistered this initiates the registration process
  else{
      registrationCodeCallback(result ,callback);
  }
}

//lookup the registration code or initiate registration process
function getRegistrationCode(intent, session, callback){
 api.lookup(session.user.userId, welcomeCallback, callback);
}

//This reads out the registration code to the user
function registrationCodeCallback(result, callback){
  var sessionAttributes = {};
  var cardTitle = "Welcome";
  var speechOutput = "your registration code is ";
  var repromptText = ""
  var shouldEndSession = false;

  var resJson = JSON.parse(result);
  var unregistered = resJson.data.registration_id;

  speechOutput = speechOutput + "<break/> <say-as interpret-as='spell-out'>" +  unregistered + "</say-as>";
  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Functions that control the skill's behavior -----------------------

// What to do when session ends/ goodbye message
function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "We have processed your request for help";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


// This builds and appropreate JSON response for speech output
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + output + "</speak>"
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

// this builds the overall json response
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
