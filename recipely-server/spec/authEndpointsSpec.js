var chai = require('chai');
var expect = chai.expect;
var handlers = require('../models/handlers');
var sinon = require('sinon');
var db = require('../models/database');
var bcrypt = require('../utils/bcrypt');
var jwtAuth = require('../utils/jwtAuth');
var sinonTest = require('sinon-test');
sinon.test = sinonTest.configureTest(sinon);
sinon.testCase = sinonTest.configureTestCase(sinon)

describe('Auth Handlers', () => {
  describe('LOGIN', function() {
  this.timeout(2000)
    it('should return token and 200 status code when the user and password are valid', sinon.test(function(done)  {
      var validToken = 'valid-token';
      var queryAsync = new this.stub(db, 'queryAsync');
      var comparePassword = new this.stub(bcrypt, 'comparePassword');
      var encodeToken = new this.stub(jwtAuth, 'encodeToken');
      var req = {
        body: {
          username: 'grady',
          password: '12345'
        }
      };
      var res = {
        status: new this.stub()
      };
      var json = new this.stub();
      res.status.returns({json: json});

      encodeToken.resolves(validToken);

      queryAsync.resolves({rows: [{password: 'hashedPassword'}]});
      comparePassword.resolves(true);
      handlers.postLogin(req, res).then(()=> {
        expect(res.status.args[0][0]).to.equal(200);
        expect(json.args[0][0]).to.equal(validToken);
        expect(comparePassword.args[0][1]).to.equal('hashedPassword');
        done();
      }).catch(done)
    }));

    it('should return 401 status code when a user enters an invalid password', sinon.test(function(done) {
      var queryAsync = new this.stub(db, 'queryAsync');
      var comparePassword = new this.stub(bcrypt, 'comparePassword');
      var req = {
        body: {
          username: 'grady',
          password: '12345'
        }
      };
      var res = {
        status: new this.stub()
      };
      var end = new this.stub();
      res.status.returns({end});


      queryAsync.resolves({rows: [{password: 'hashedPassword'}]});
      comparePassword.resolves(false);
      handlers.postLogin(req, res).then(()=> {
        expect(res.status.args[0][0]).to.equal(401);
        expect(end.args[0][0]).to.equal('invalid password or username');
        done();
      }).catch(done)
    }));

    it('should return 401 status code when a user enters an invalid username', sinon.test(function(done) {
      var queryAsync = new this.stub(db, 'queryAsync');
      var req = {
        body: {
          username: 'grady',
          password: '12345'
        }
      };
      var res = {
        status: new this.stub()
      };
      var end = new this.stub();
      res.status.returns({end});


      queryAsync.resolves({rows: []});
      handlers.postLogin(req, res).then(()=> {
        expect(res.status.args[0][0]).to.equal(401);
        expect(end.args[0][0]).to.equal('invalid password or username');
        done();
      }).catch(done)
    }))
    
  });

  describe('SIGNUP', () => {
    it('should return a token and 200 status code when signing up a new user', sinon.test(function(done) => {

    }));
    it('')
  })
});
