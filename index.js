var api = require('./ApiRequests.js');
var app_id = "";

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
        }
        */

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
 */
 //I DONT THINK THIS DOES ANYTHING
 //JUST LOGS TO THE CONSOLE
 //I GUESS WE COULD ADD STUFF HERE AS NEEDED
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */

 //OVERRIDE THE getWelcomeResponse TO CHANGE WHAT HAPPENDS WHEN THE SKILL IS LAUNCHED
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback, session);
}

/**
 * Called when the user specifies an intent for this skill.
 */
 //THIS DOES ALL THE INTENT ROUTING. ITS SUPER SIMPLE.
 //WATCHOUT FOR THE DIFFERENCE BETWEEN == and ===
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if("GetRegistrationCodeIntent" === intentName){
        getRegistrationCode(intent, session, callback);
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

 //I DIDN'T DO ANYHTING HERE
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}


/**
*this need to
* 1) see if user exists
* 2a) if user does not exist give them registration token
* 2b) if user exists register call for help in database
*/
function getWelcomeResponse(callback, session){

 api.service(session.user.userId, welcomeCallback, callback);
 
}

function welcomeCallback(result, callback){
  var sessionAttributes = {};
  var cardTitle = "Welcome";
  var speechOutput = result;
  var repromptText = ""
  var shouldEndSession = false;

  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
// //tell user that request has been handeled
// function handleSessionEndRequest(callback) {
//
// }
//
// //lookup the registration code if the user has forgotten theirs
// function getRegistrationCode(intent, session, callback){
//
// }
//
// function getService(intent, session, callback){
//
// }

// --------------- Functions that control the skill's behavior -----------------------

//ALL I DID WAS CHANGE THE STRING VALUES
function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for playing the number guessing game. Have a Fantastic Day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
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

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
