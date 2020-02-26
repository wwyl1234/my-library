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

// Initialize Firebase once
firebase.initializeApp(FIREBASECONFIG);

$(document).ready(function() {
    // Data from https://my-library-bd9da.firebaseio.com/books/.json is an array of objects.
    $('#booksTable').DataTable( {
        "ajax": {
            "url": 'https://my-library-bd9da.firebaseio.com/books/.json',
            "method": "GET",
            "dataSrc": ""
            },
        "columns": [
            { data : "name" },
            { data : "author" },
            { data : "location" },
            { data : "borrowed" },
            { data : "isbn" }
        ]
    } );
    
    $(function(){
        $('#addBookForm').on('submit', function(e){
          e.preventDefault();
          let postData = getAddBookData();
          console.log(postData);
          // need to ajax post to database
          $.ajax({
            url: 'https://my-library-bd9da.firebaseio.com/books/.json',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            });
        });
    });

});

// Returns a json of a book to be added to the database
function getAddBookData(){
    let name = $('#name').val();
    let author = $('#author').val();
    let location = $('#location').val()
    let borrowed = null;
    let isbn = $('#isbn').val();

    if ($('#borrowedSetTrue').is(':checked'))
    {
        borrowed = true;
    }

    if ($('#borrowedSetFalse').is(':checked')){
        borrowed = false;
    }

    if (borrowed == null){
        return {};
    }

    return { 
        "name" : `${name}`,
        "author" : `${author}`,
        "location" : `${location}`,
        "borrowed" : `${borrowed}`,
        "isbn" : `${isbn}`,
    }

}

function addBookHandler(){
    console.log("test");
    signIn();
}

function signIn(){


function loadFirebaseDatabase(){
    // Might need to get rid of this as datatable works well with ajax call
    var db = firebase.database();
    var ref = db.ref("books");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        var id=childData.id;
        console.log(childData);
        // get if from the table Element
        let tableData = `<tr>
        <td>${childData.name}</td>
        <td>${childData.author}</td>
        <td>${childData.location}</td>
        <td>${childData.borrowed}</td>
        </tr>`
        // load data into table;
        console.log("appended data");
        $("#booksData").append(tableData);
        });
    });
}

var provider = new firebase.auth.GithubAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // load the pop-up form


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
}

