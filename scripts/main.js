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
// Get a database reference to our posts
var db = firebase.database();
var ref = db.ref("books");
ref.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
     var childData = childSnapshot.val();
     var id=childData.id;
     console.log(childData);
     // get if from the table Element
     let tableData = `<tr>
     <th>${childData.name}</th>
     <th>${childData.author}</th>
     <th>${childData.location}</th>
     <th>${childData.borrowed}</th>
   </tr>`
     $("#booksTable").append(tableData);
     // load data into table;

    });
   });




var provider = new firebase.auth.GithubAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  



  
//console.log(db);
//console.log(ref);