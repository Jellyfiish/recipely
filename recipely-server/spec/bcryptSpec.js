var bcrypt = require('../models/bcrypt');
var chai = require('chai');
var expect = chai.expect

describe('bcrypt', () => {
  const password = 'password';
  const wrongPassword = 'wrong password';
  var hashedPassword;
  
  it('should return a string that is longer than 58 chars', (done) => {
  	bcrypt.hashPassword(password).then(hash => {
  		hashedPassword = hash;
  		expect(hash.length > 58).to.be.true;
  		done();
  	});
  });
  
  it('should return true when we compare a password with its hashed version', (done) =>{
  	bcrypt.comparePassword(password, hashedPassword).then(match => {
  		expect(match).to.be.true;
  		done();
  	});
  });

  it('should return false when we compare a password with the wrong hash', (done) =>{
  	bcrypt.comparePassword(password, wrongPassword).then(match => {
  		expect(match).to.be.false;
  		done();
  	});
  });
});