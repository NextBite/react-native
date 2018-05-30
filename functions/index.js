//import firebase functions modules
const functions = require('firebase-functions');
//import admin module
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// Listens for new messages added to messages/:pushId
exports.pushNotification = functions.database.ref('/listings/{pushId}').onCreate(event => {
  // Create a notification
  //console.log("event data", event._data);
  const payload = {
    notification: {
      title: "New Rescue Available",
      body: `${event._data.location.split(",")[0]} has a pickup available. Expires at ${String(new Date(event._data.expirationDate)).split(" ")[4].slice(0, -3)}.`,
      sound: "default",
    },
  };

  //Create an options object that contains the time to live for the notification and the priority
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  return admin.messaging().sendToTopic("newListing", payload, options);
});

// Listens for updates made to listings/:pushId/claimedBy
exports.claimedPushNotification = functions.database.ref('/listings/{pushId}/claimedBy').onUpdate(event => {
  let listingId = event.after._path.split("/")[2];

  // query for the id of the vendor who created the donation that was claimed
  let promise1 = admin.database()
    .ref(`/listings/${listingId}/userId`)
    .once('value')
    .then(snapshot => {
      return Promise.resolve(snapshot.node_.value_);
    });

  let promise2 = promise1.then(function (userId) {
    // query for the fcm token of the vendor
    let promise3 = admin.database()
      .ref(`/users/${userId}/fcmToken`)
      .once('value')
      .then(snapshot => {
        return Promise.resolve(snapshot.node_.value_);
      });

    return Promise.resolve(promise3);
  });

  const payload = {
    notification: {
      title: "Donation Claimed",
      body: `A volunteer has claimed your donation. They will be arriving soon to pick it up.`,
      sound: "default",
    },
  };

  //Create an options object that contains the time to live for the notification and the priority
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  // sendToDevice can also accept an array of push tokens
  return Promise.all([promise1, promise2]).then(function (values) {
    return admin.messaging().sendToDevice(values[1], payload, options);
  })
});

// Listens for updates made to listings/:pushId/delivered
exports.deliveredPushNotification = functions.database.ref('/listings/{pushId}/delivered').onUpdate(event => {
  let listingId = event.after._path.split("/")[2];

  // query for the id of the vendor who created the donation that was claimed
  let promise1 = admin.database()
    .ref(`/listings/${listingId}/userId`)
    .once('value')
    .then(snapshot => {
      return Promise.resolve(snapshot.node_.value_);
    });

  let promise2 = promise1.then(function (userId) {
    // query for the fcm token of the vendor
    let promise3 = admin.database()
      .ref(`/users/${userId}/fcmToken`)
      .once('value')
      .then(snapshot => {
        return Promise.resolve(snapshot.node_.value_);
      });

    return Promise.resolve(promise3);
  });

  const payload = {
    notification: {
      title: "Donation Delivered",
      body: `A volunteer has delivered your donation successfully.`,
      sound: "default",
    },
  };

  //Create an options object that contains the time to live for the notification and the priority
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  // sendToDevice can also accept an array of push tokens
  return Promise.all([promise1, promise2]).then(function (values) {
    return admin.messaging().sendToDevice(values[1], payload, options);
  })
});
