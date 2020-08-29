// Here lies tests for isbn.js

//var chai = require('chai');
var assert = chai.assert;

/* Tests for convertIsbn10ToIsbn13 function */
describe('convertIsbn10ToIsbn13', function() {
  it('should convert a valid ISBN10 to ISBN13', function() {
    assert.equal("9781541698963", convertIsbn10ToIsbn13("1541698967"));
  });

  it('should return empty string if given an invalid ISBN10', function(){
    assert.equal('', convertIsbn10ToIsbn13(1541698967));
    assert.equal('', convertIsbn10ToIsbn13('15416989670'));
    assert.equal('', convertIsbn10ToIsbn13('15-4169896'));
    assert.equal('', convertIsbn10ToIsbn13('978-161484100'));
    assert.equal('', convertIsbn10ToIsbn13(''));
    assert.equal('', convertIsbn10ToIsbn13(true));
    assert.equal('', convertIsbn10ToIsbn13([]));
    assert.equal('', convertIsbn10ToIsbn13(null));
  });
});

/* Tests for isValidIsbn10 function */
describe('isValidIsbn10', function() {
  it('should return true if given a valid ISBN10', function() {
    assert.equal(true, isValidIsbn10("0306406152"));
    assert.equal(true, isValidIsbn10("1541698967"));
  });

  it('should return false if the length of argument is not 10', function() {
    assert.equal(false, isValidIsbn10("030640615"));
    assert.equal(false, isValidIsbn10("15"));
    assert.equal(false, isValidIsbn10("12345678901"));
  });

  it('should return false if argument is not a string', function() {
    assert.equal(false, isValidIsbn10(0306406152));
    assert.equal(false, isValidIsbn10(true));
    assert.equal(false, isValidIsbn10([]));
  });

  it('should return false if argument contains characters that are not digits', function() {
    assert.equal(false, isValidIsbn10("0306406-5"));
    assert.equal(false, isValidIsbn10("0-306-40615-2"));
    assert.equal(false, isValidIsbn10("(416)123-4567"));
    assert.equal(false, isValidIsbn10("$10234#4579"));
  });

});

/* Tests for isValidIsbn13 function */
describe('isValidIsbn13', function() {
  it('should return true if given a valid ISBN13', function() {
    assert.equal(true, isValidIsbn13("9781541698963"));
    assert.equal(true, isValidIsbn13("9783161484100"));
  });

  it('should return false if the length of argument is not 13', function() {
    assert.equal(false, isValidIsbn13("978154169896"));
    assert.equal(false, isValidIsbn13("15"));
    assert.equal(false, isValidIsbn13("123456789012345"));
  });

  it('should return false if argument is not a string', function() {
    assert.equal(false, isValidIsbn13(9781541698963));
    assert.equal(false, isValidIsbn13(true));
    assert.equal(false, isValidIsbn13([]));
  });

  it('should return false if argument contains characters that are not digits', function() {
    assert.equal(false, isValidIsbn13("978-161484100"));
    assert.equal(false, isValidIsbn13("0-306-40615-2"));
    assert.equal(false, isValidIsbn13("(416)123-4567"));
    assert.equal(false, isValidIsbn13("$10234#4579"));
  });

});