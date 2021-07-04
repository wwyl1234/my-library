// Here lies the main functions to load the Firebase database and add new book

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

    // Load datatabase into table.
    // Data from https://my-library-bd9da.firebaseio.com/books/.json is an array of objects.
    var table = $('#booksTable').DataTable( {
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

    // This can be use to filter the table and  filter by borrowed is false 
    table.column(3).search('false', true, false).draw();
    
    // Add book to database, when user click submit button on the form.
    $(function(){
        $('#addBookForm').on('submit', function(e){
          e.preventDefault();
          let postData = getAddBookData();
          console.log(postData);
          addBookToDatabase(postData);
          
          // need to reload table with a timeout of 2 minutes
          let reload = $('#booksTable').DataTable().ajax.reload
          setTimeout(reload, 7200);
        
          // need to close window
          $('#addBookModal').modal('toggle');
        });
    });

    // Login, when user click submit button on the form.
    $(function(){
        $('#loginForm').on('submit', function(e){
            e.preventDefault();
            let email = $('#email').val();
            let password = $('#password').val();
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    $('#addBookButton').css("visibility", "visible");
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                });
          
          // need to close window
          $('#loginModal').modal('toggle');
        });
    });

});

// Returns a JSON of a book to be added to the database
function getAddBookData(){
    let name = $('#name').val();
    let author = $('#author').val();
    let location = $('#location').val()
    let borrowed = null;
    let isbn = $('#isbn').val();

    // Deal with the radio check box for borrowed property
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

    // Deal with the radio check box for ISBN13 or ISBN10
    if ($('#isbn10').is(':checked'))
    {
        if(!isValidIsbn10(isbn)){
            console.warn('User gave an invalid ISBN10.');
            return {};
        }
        isbn = convertIsbn10ToIsbn13(isbn);
    }

    if ($('#isbn13').is(':checked')){
        if(!isValidIsbn13(isbn)){
            console.warn('User gave an invalid ISBN13.');
            return {};
        }
    }

    if (isbn == null){
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

// Returns an integer which should be a new key for the soon to be added book.
// Make sure the books table is loaded before using this function.
function getNewKey(){
    let booksTable = $('#booksTable').DataTable();
    return booksTable.data().length;
    
}

// Given data, a JSON object representing a book, add it to the database.  
function addBookToDatabase(data){
    let db = firebase.database();
    let ref = db.ref("books");
    let newBookRef = ref.child(getNewKey());
    newBookRef.set(data);
}
