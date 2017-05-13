var axios = require('axios');
var chai = require('chai');
var expect = chai.expect;
var server = require('../server');
var sinon = require('sinon');
var db = require('../models/database');
var bcrypt = require('../utils/bcrypt');
var jwtAuth = require('../utils/jwtAuth');

describe('Auth Endpoints', () => {
  const options = {
  	url: 'http://127.0.0.1:8080/api/login',
  	method: 'POST',
  	data: {
  		username: 'user',
  		password: 'secret'
  	}
  }

  it('should return token and 200 status code when the user and password are valid', (done) => {
    const validToken = 'valid-token';
    const queryAsync = new sinon.stub(db, 'queryAsync');
    const comparePassword = new sinon.stub(bcrypt, 'comparePassword');
    const encodeToken = new sinon.stub(jwtAuth, 'encodeToken');
    //const status = new sinon.stub();
    //const res = new sinon.stub();

    const res = {
      status: () => {}
    };
    const status = new sinon.stub(res, 'status');
    const json = new sinon.stub();
    status.returns({json: json});

    encodeToken.returns(Promise.resolve(validToken));

    queryAsync.returns(Promise.resolve({rows: [1]}));
    comparePassword.returns(Promise.resolve(true));
  	axios(options)
      .then(response => {
        console.log(status.args)
        expect(json.args[0][0] === validToken).to.be.true;
        done();
      }).catch(e => {console.log(e);done();})
  });
});

//

// db.queryAsync('SELECT * from users where username = $1', [body.username])
//     .then((results)=> {
//       if(results.rows.length) {
//         bcrypt.comparePassword(body.password, results.rows[0].password).then(match => {
//           if(!match) {
//             res.status(401).end('invalid password or username');
//             return;
//           }

//           jwtAuth.encodeToken(results.rows[0].id, results.rows[0].username).then(token => {
//             res.status(200)
//               .json(token);
//           }).catch(err => res.status(402).end('invalid password or username'))
//         }).catch(err => {
//           res.status(401).end('invalid password or username');
//         })
//       } else {
//         res.status(401).end('invalid password or username');
//       }
//     });