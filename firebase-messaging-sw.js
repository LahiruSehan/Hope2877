importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCyaunkYk3-rtoDQ2EFB1M3f0BXWo_YBzE",
  authDomain: "thelight-545c1.firebaseapp.com",
  projectId: "thelight-545c1",
  storageBucket: "thelight-545c1.appspot.com",
  messagingSenderId: "788085609882",
  appId: "1:788085609882:web:910e17ff6ca0aae3702de3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png"
  });
});
