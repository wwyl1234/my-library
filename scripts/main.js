// Your web app's Firebase configuration
const FIREBASECONFIG = {
    apiKey: "AIzaSyAD4AQ7r8JkjnI3mrsvMvqhe8OE5XFAXR0",
    authDomain: "my-library-bd9da.firebaseapp.com",
    databaseURL: "https://my-library-bd9da.firebaseio.com",
    projectId: "my-library-bd9da",
    storageBucket: "my-library-bd9da.appspot.com",
    messagingSenderId: "534624176828",
    appId: "1:534624176828:web:cff990b38744ae58f99eb9",
    measurementId: "G-21398Y6TTY"
  };

// Initialize Firebase
firebase.initializeApp(FIREBASECONFIG);
firebase.analytics();
let database = firebase.database();
console.log(database);
