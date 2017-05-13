const jwtAuth = require('../models/jwtAuth');
const chai = require('chai');
const expect = chai.expect;

describe('JWT Authentication', () => {
	var testToken;
	var expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.\
	eyJleHAiOjE0OTQ1NDMzNTgsImlhdCI6MTQ5NDU0MzM1OCwic3ViIjoidGVzdCIsImlzcyI6InRlc3QifQ\
	.4v3DTIAivhbjvqZP5DWWJ4pqT2H138Ue0ZeB_dN_mLs';
	
	it('should return token when passing valid parmeters', (done) => {
	  jwtAuth.encodeToken('test', 'test').then(token => {
	  	testToken = token;
		expect(token).to.be.a('string');
		expect(token.length > 10).to.be.true;
		done();
	  });
	});

	it('should decode the token', (done) => {
	  jwtAuth.decodeToken(testToken).then(payload => {
        expect(payload.sub).to.equal('test');
        done();
	  });
	});
	
	it('should return error when decoding expired token', (done) => {
	  jwtAuth.decodeToken(expiredToken).then(token => console.log('TOKEN, ', token)).catch(err => {
        expect(err).to.be.an('object');
        done();
	  });
	})
});