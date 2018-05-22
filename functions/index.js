//import firebase functions modules
const functions = require('firebase-functions');
//import admin module
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// Listens for new messages added to messages/:pushId
exports.pushNotification = functions.database.ref('/listings/{pushId}').onCreate(event => {
  // Create a notification
  console.log("event data", event._data);
  const payload = {
    notification: {
      title: "New Rescue Available",
      body: `${event._data.location.split(",")[0]} has a pickup available. Expires at ${String(new Date(event._data.expirationDate)).split(" ")[4].slice(0, -3)}.`,
      sound: "default"
    },
  };

  //Create an options object that contains the time to live for the notification and the priority
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  return admin.messaging().sendToTopic("newListing", payload, options);
});
