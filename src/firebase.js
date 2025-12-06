// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD9Vnp9DXI6LyF1Q9Asu-tPWpO3TCkBw",
  authDomain: "thelight-545c1.firebaseapp.com",
  projectId: "thelight-545c1",
  storageBucket: "thelight-545c1.appspot.com",
  messagingSenderId: "788085609882",
  appId: "1:788085609882:web:910e17ff6ca0aae3702de3"
};

// Init
firebase.initializeApp(firebaseConfig);

// Messaging instance
const messaging = firebase.messaging();

// EXPOSE FUNCTIONS TO GLOBAL WINDOW
window.requestNotificationPermission = async () => {
  console.log("Requesting notification permission...");
  
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await messaging.getToken({
      vapidKey:
        "BJvYGLMMaba1MvY_0WZwabx9mF94FwbPhih9aMLZC_gAGq8-d8WH0HF8x81mZL5glGXsuVrQ3ejjwJtshYiVA84"
    });

    console.log("FCM Token:", token);
    return token;
  } else {
    console.log("Notification denied");
    return null;
  }
};

window.onFirebaseForegroundMessage = (callback) => {
  messaging.onMessage((payload) => {
    callback(payload);
  });
};
