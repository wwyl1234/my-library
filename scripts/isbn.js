/*
* This module is intended to contain the ISBN related functions.
*/ 

// Given a ISBN10 string with no dashes, convert it to the ISBN13 represented as a string with no dashes.
function convertIsbn10ToIsbn13(isbn10){
     // Check if isbn10 is valid
    if (!isValidIsbn10(isbn10)){
        console.warn(`${isbn10} is not a valid ISBN10 or not expecting dashes in argument`);
       return "";
    }
    let prefix = "978";
    let middle = isbn10.substring(0, isbn10.length - 1);
    let isbn13 = prefix + middle;
    // Determine the checksum of the ISBN13 number
    let sum = 0;
    for (let i = 0; i < isbn13.length; i++){
        if (i % 2 == 0){
            sum += parseInt(isbn13[i]);
        }
        else {
            sum += 3 * parseInt(isbn13[i]);
        }
    }
    let checksum = 10 - (sum % 10);
    return isbn13 + checksum;
}

// Return true, if the given string is a valid ISBN10 with no dashes. Otherwise, return false.
function isValidIsbn10(isbn10){
    if (typeof isbn10 != "string"){
        console.warn(`${isbn10} is not a string. Expecting the argument to be a string.`);
        return false;
    }
    if (isbn10.length != 10){
        console.warn(`${isbn10} does not have a length of 10. Expecting the argument to have length of 10`)
        return false;
    }
    // Use regex to check that it has only digits
    let pattern = /[0-9]{10}/;
    if (!(pattern.test(isbn10))){
        console.warn(`${isbn10} does not match the pattern ${pattern}`);
        return false;
    }
    // follow algorithm to check isbn10 digits
    let sum = 0;
    for (let i = 0; i < isbn10.length; i++){
        sum += (11 - i - 1) * parseInt(isbn10[i]);
    }
    if (sum % 11 == 0){
        return true;
    } else {
        return false;
    }
}


// Return true, if the given string is a valid ISBN13 with no dashes. Otherwise, return false.
function isValidIsbn13(isbn13){
    if (typeof isbn13 != "string"){
        console.warn(`${isbn13} is not a string. Expecting the argument to be a string.`);
        return false;
    }
    if (isbn13.length != 13){
        console.warn(`${isbn13} does not have a length of 13. Expecting the argument to have length of 13`)
        return false;
    }
    // Use regex to check that it has only digits
    let pattern = /[0-9]{13}/;
    if (!(pattern.test(isbn13))){
        console.warn(`${isbn13} does not match the pattern ${pattern}`);
        return false;
    }

    // follow algorithm to check isbn13 digits
    let sum = 0;
    for (let i = 0; i < isbn13.length; i++){
        if (i % 2 == 0){
            sum += parseInt(isbn13[i]);
        }
        else {
            sum += 3 * parseInt(isbn13[i]);
        }
    }
    if (sum % 10 == 0){
        return true;
    } else {
        return false;
    }
}