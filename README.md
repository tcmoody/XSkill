# ProjectXSkill

Project Req's
(1) The user will say "Alexa, launch ProjectX".   

(2) The application will look in a database table on the Amazon server to see if this deviceId has ever registered for our service.   This will be a simple command like:  Select * from RegisteredUsers where deviceid = 'echo device id'.   (I am assuming there is a way to uniquely identify the echo device.  This is critical to the functionality of my app.  My app will not work if there is no way to identify the device.)

(3) If a row is returned from the above query, the user has previously registered with our service and the application will do 2 simple things:

	(3a) Insert a row into a database table like this:   Insert into RequestedAction (DeviceId, ActionValue) values ('echo device id', 'RequestService') 

	(3b) Then the app will respond to the user:   "Thank you, your request has been successfully processed".     

(4) If no row was returned from the query in step# 2, this means the user has not registered at our website.  The application will do this:

	(a) Generate a unique number.

	(b) Insert the device id and that generated unique number into a database table like this:   
	Insert into UnregisteredUsers (DeviceId, UniqueNumber) values ('echo device id', 'unique number')  

	(c) Then respond with this message:   Before ProjectX can be used, you must register at our website: blah-blah-blah.com.   Your registration number will be [say the generated unique number].   If you forget your registration number or the registration website, simply Launch ProjectX again and your registration information will be repeated.  Thank you.

QUESTIONS:
DeviceID or amazon account for backend registration?
User details for registration? (email, phone number, etc)

INTENTS:

(1)Launch

	(a)override the onLaunch function

	(b)send device id to backend

	(c)if device is registered -> request intent

	(d)if device is not registered -> registration intent

(2)Request

	(a)hit the backend to register the request

	(b)echo thanks user for request

	(c)close projectX

(3)Registration

	(a)get registrationID from backend

	(b)echo communicates said ID to user
	
	(c)close projectX