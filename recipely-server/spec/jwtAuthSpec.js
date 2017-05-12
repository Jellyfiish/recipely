const jwtAuth = require('../models/jwtAuth');
const chai = require('chai');
const expect = chai.expect;

describe('JWT Authentication', () => {
	var testToken;
	var expiredToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.\
	eyJleHAiOjE0OTQ1NDMzNTgsImlhdCI6MTQ5NDU0MzM1OCwic3ViIjoidGVzdCIsImlzcyI6InRlc3QifQ\
	.4v3DTIAivhbjvqZP5DWWJ4pqT2H138Ue0ZeB_dN_mLs';
	
	it('should return token when passing valid parmeters', () => {
	  jwtAuth.encodeToken('test', 'test', (err, token) => {
	  	testToken = token;
		expect(token).to.be.a('string');
		expect(token.length > 10).to.be.true;
	  });
	});

	it('should decode the token', () => {
	  jwtAuth.decodeToken(testToken, (err, payload) => {
        expect(payload.sub).to.equal('test');
	  });
	});
	
	it('should return error when decoding expired token', () => {
	  jwtAuth.decodeToken(expiredToken, (err, payload) => {
        expect(err).to.equal('Token has been expired');
	  });
	})
});