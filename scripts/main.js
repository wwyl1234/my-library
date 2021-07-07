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
            { data : "location", "visible": false,},
            { data : "borrowed", "visible": false,},
            { data : "isbn" },
            { data : "needAuth", "visible": false }
        ]

    } );

    // This can be use to filter the table and  filter by borrowed is false 
    table.column(3).search('false', true, false).draw();
    // This can be use to filter the table and  filter by needAuth is false 
    table.column(5).search('false', true, false).draw();
    
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
                    $('#updateBookButton').css("visibility", "visible");
                    
                    // Undo the filters for unauthorized users
                    table.search('')
                        .columns().search('')
                        .draw();
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

    // Get book data , when user click on Get Data button in the update book modal dialog
    $('#getBookDataButton').click(function(){
        console.log('pressed');
        let isbn = $('#updateIsbn').val();
        if (isValidIsbn13(isbn)){
            getBookObj(isbn)
                .then(result => {
                    console.log(result);
                    let element = $("#bookData");
                    element.html(JSON.stringify(result[Object.keys(result)[0]], undefined, 2));
                })
                .catch(error => {
                    console.warn('ISBN not in database!');
                });
        } else {
            console.warn("Invalid isbn13")
        }
    });
    
    // Update book, when user click submit button on the form.
    $(function(){
        $('#updateBookForm').on('submit', function(e){
            e.preventDefault();
            let isbn = $('#updateIsbn').val();
            let property = $('#property').val();
            let value = $('#updateValue').val();
            updateBook(isbn, property, value)

            // need to reload table with a timeout of 2 minutes
            let reload = $('#booksTable').DataTable().ajax.reload
            setTimeout(reload, 7200);
          
          // need to close window
            $('#updateBookModal').modal('toggle');
        });
    });

});

// Returns a JSON of a book to be added to the database
function getAddBookData(){
    let name = $('#name').val();
    let author = $('#author').val();
    let location = $('#location').val();
    let borrowed = null;
    let isbn = $('#isbn').val();
    let needAuth = null; 

    // Deal with the radio check box for borrowed property
    if ($('#borrowedSetTrue').is(':checked'))
    {
        borrowed = true;
    }

    if ($('#borrowedSetFalse').is(':checked')){
        borrowed = false;
    }

    // Deal with the radio check box for needAuth property
    if ($('#needAuthSetTrue').is(':checked'))
    {
        needAuth = true;
    }

    if ($('#needAuthSetFalse').is(':checked')){
        needAuth = false;
    }


    if (borrowed == null || needAuth == null){
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
        "needAuth" : `${needAuth}`
    }

}

// Returns promise containing an integer which should be a new key for the soon to be added book.
async function getNewKey(){
    let db = firebase.database();
    let ref = db.ref("books");
    let result = await ref.once("value")
        .then ( snap  => {
            return newKey = snap.numChildren();
        })
        .catch( error => {
            console.log(error);
        })
    return result;
}

// Given data, a JSON object representing a book, add it to the database.  
function addBookToDatabase(data){
    let db = firebase.database();
    let ref = db.ref("books");
    getNewKey().then(result  => {
        let newBookRef = ref.child(result);
        newBookRef.set(data);
   })
}


// Given the isbn in str format, return the promise containing the book object.
async function getBookObj(isbn){
    if(!isValidIsbn13(isbn)){
        throw 'User gave an invalid ISBN13.';
    }
    let db = firebase.database();
    let ref = db.ref("books");

    
    let result = await ref.orderByChild('isbn').equalTo(isbn).once("value")
        .then (snap  => {
            let obj = snap.val()
            console.log(obj)
            console.log(Object.keys(obj)[0])
            console.log(obj[Object.keys(obj)[0]])
            return snap.val();
        })
        .catch(error => {
            console.warn('ISBN not in database!')
        })
    return result;
    
}

// Update book with given existing isbn in database, property and value
function updateBook(isbn, property, value){
    let db = firebase.database();
    let ref = db.ref("books");
    getBookObj(isbn)
        .then(result => {
            let bookId = Object.keys(result)[0]
            console.log(bookId)
            let data = result[bookId];
            data[property] = value
            console.log(data)
            let bookRef = ref.child(parseInt(bookId));
            console.log(bookRef)
            bookRef.set(data);
        })
        .catch(error => {
            console.warn('ISBN is not in database!');
        })
}