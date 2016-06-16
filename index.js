/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
 //I DID NOT WRITE THIS
 //THIS DEALS WITH ROUTING DIFFRENT EVENT TYPES
 //WE ONLY USE THE INTENT EVENTS

var http = require('http');
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
    getWelcomeResponse(callback);
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
        getWelcomeResponse(callback);
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
function getWelcomResponse(callback){
  var sessionAttributes = {};
  var cardTitle = "Welcome";
  var speechOutput = "Welcome to the Number Guessing Game.";
  var shouldEndSession = false;


  callback(sessionAttributes,
      buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

//tell user that request has been handeled
function handleSessionEndRequest(callback) {

}

//lookup the registration code if the user has forgotten theirs
function getRegistrationCode(intent, session, callback){

}

// --------------- Functions that control the skill's behavior -----------------------
//RESPONSE ON SKILL LAUNCH
function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Number Guessing Game.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText =  "Please Guess a number between one and ten.";
    var shouldEndSession = false;
    sessionAttributes = createNumberAttribute();
}

//ALL I DID WAS CHANGE THE STRING VALUES
function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for playing the number guessing game. Have a Fantastic Day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

//THIS IS MY CUSTOM INTENT FUCNTION
//
function guessNumber(intent, session, callback){
      var cardTitle = intent.name;
      var guessSlot = intent.slots.Guess;
      var repromptText = "";
      var sessionAttributes = {};
      var shouldEndSession = false;
      var speechOutput = "";

      //checks that we are on the correct intent
      if(guessSlot){
        //this can be empty/null
        var guess = guessSlot.value;
        var answer;
          //checks the session (Cookies?) to see if a answer has been set
          if(session.attributes){
            answer = session.attributes.numberToGuess;
          }
          //checks if answer has been set
          if(answer){
            //if guess is correct. the == will cast the string value of guess to a number.
            // === uses strict typing so 1 === "1" is false
            // == is loose typing 1 =="1" is true
            if( answer == guess){
              speechOutput = "You Win. Goodbye"
              //this automaitcally handels ending the session
              shouldEndSession = true;
            }else{
              speechOutput = "Wrong number";
              repromptText = "Please guess another number between one and ten";

              //puts the answer in the session (cookie?)
              sessionAttributes = {numberToGuess : parseInt(answer)};
            }
          }else{
              speechOutput = "We have not started yet";
              repromptText = "Ok. I'm ready. Please guess a number between one and ten";
              //creates a new random number and puts it in the session
              sessionAttributes = createNumberAttribute();
          }
      } else {
        speechOutput = "That guess was not a number";
        repromptText = "Please guess a number between one and ten";
      }

      //this is amazon boiler plate. I'm not totally sure whats happening here
      callback(sessionAttributes,
           buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));

}

//creates random number between [1,10] and puts it in a session/
function createNumberAttribute(){
  return {
    numberToGuess: Math.floor(Math.random() * (10 - 1 + 1) + 1)
  };
}

//I DID NOT BUILD THIS
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

//I DID NOT BUILD THIS
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
