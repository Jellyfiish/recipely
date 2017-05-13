const isAuthenticated = require('../models/auth');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const jwtAuth = require('../models/jwtAuth');
const db = require('../models/database');
describe('AUTH', () => {

	it('should return true if the header has a token in it', () => {
	  const next = new sinon.stub();
	  const res = new sinon.stub();
	  const decodeToken = new sinon.stub(jwtAuth, 'decodeToken'); 
	  const queryAsync = new sinon.stub(db, 'queryAsync');
	  const testToken = 'some-token'
	  const req = {
		header: new sinon.stub()
	  }
	  decodeToken.returns(Promise.resolve({sub: 1231}));
	  queryAsync.returns(Promise.resolve({rows: [123]}));
	  req.header.withArgs('x-access-token').returns('Bearer ' + testToken);
	  isAuthenticated(req,res, next);
	  expect(decodeToken.called).to.be.true;
	  expect(decodeToken.args[0][0] === testToken).to.be.true;
	  decodeToken.restore();
	});

	it('should return 400 as status code when there is no token header', () => {
	  const next = new sinon.stub();
	  const decodeToken = new sinon.stub(jwtAuth, 'decodeToken'); 
	  const req = {
		header: new sinon.stub()
	  };

	  const res = {
	  	status: new sinon.stub()
	  }
	  const end = new sinon.stub();

	  res.status.returns({end: end})
	  req.header.withArgs('x-access-token').returns(undefined);
	  isAuthenticated(req,res, next);
	  expect(res.status.called).to.be.true;
	  expect(res.status.args[0][0] === 400).to.be.true;
	  expect(end.args[0][0] === 'please log in!').to.be.true;
	  expect(decodeToken.called).to.be.false;
	  decodeToken.restore();
	});

});

// isAuthenticated = (req, res, next)
// const decodeToken = new sinon.stub(jwtAuth, 'decodeToken'); 
