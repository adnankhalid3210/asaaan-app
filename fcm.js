importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// firebase.initializeApp({
//   'messagingSenderId': '237185776974'
// });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
// const messaging = firebase.messaging();
self.addEventListener('notificationclick', function (event) {
//   console.log('clicked');
//   console.log(event);
//   console.log(event.notification);
  console.log(event.notification.tag); // Redirect Url in tag

  clients.openWindow("https://www.google.com");
  event.notification.close();
})

