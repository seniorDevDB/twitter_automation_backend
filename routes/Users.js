"use strict";
const cors = require("cors");
// Password Hash MD5
var md5 = require('md5');
// JSON WEB TOKEN
var jwt = require('jsonwebtoken');
const jwtSecret = 'ABTWOFKRSJDKFTLSKFJSOWK';

// Models
const UserCollection = require('../models/UserModal');

process.env.SECRET_KEY = "secret";

module.exports = (app) => {
    app.use(cors());

    app.post("/signup", (req, res) => {
        const userData = {
            email: req.body.email,
            password: req.body.password
        }
        console.log("userD", userData)
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash;
            UserCollection.create(userData, function(err) {
                console.log("error")
            })
        });
    })

    // Create User
    app.post('/join', (req, res) => {
        console.log(req.body)
        let email = req.body.email;
        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let password = md5(req.body.password);
        UserCollection.findOne({email}).then(user => {
        if( user === null ) {
            UserCollection.create({
                email,
                firstName,
                lastName,
                password,
                admin: false,
                active: false,
            }, function(err) {
            if( err ) {
                res.send(JSON.stringify({
                code: 'failed',
                message: 'Something went wrong on backend, try again!'
                }));
            } else {
                res.send(JSON.stringify({
                code: 'success',
                message: 'Successfully created an account, try Login!'
                }));
            }
            });
        } else {
            res.send(JSON.stringify({
            code: 'failed',
            message: 'You already have an account!'
            }));
        }
        });
    });

    // app.post("/login", (req, res) => {
    //     console.log("login called from frontend");
    //     UserCollection.findOne({"email": req.body.email}).then(user => {
    //         if (user && user.length != 0) {
    //             if (bcrypt.compareSync(req.body.password, user.password)) {
    //                 console.log("password mathces")
    //                 let token = jwt.sign(user.email, process.env.SECRET_KEY);
    //                 console.log("here is token", token)
    //                 res.send({token: token})
    //             }
    //             else {
    //                 console.log("incorrect password");
    //                 res.json({ error: "Password is not correct" });
    //             }
    //         }
    //         else {
    //             console.log("does not exist");
    //             res.json({ error: "User does not exist" });
    //         }
    //     })
    // })
    // User Login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    
    UserCollection.findOne({email}).then(user => {
      if( user === null ) {
        res.send(JSON.stringify({
          code: 'failed',
          message: 'Email is not found!'
        }));
      } else {
        if( !user.active ) {
          res.send(JSON.stringify({
            code: 'failed',
            message: 'User is not active now!'
          }));
        } else if( user.password === password ) {
          const token = jwt.sign(
            { email: email },
            jwtSecret,
            { expiresIn: '24h' });
          res.send(JSON.stringify({
            code: 'success',
            message: 'Successfully Logged In!',
            token: token,
            admin: user.admin
          }));
        } else {
          res.send(JSON.stringify({
            code: 'failed',
            message: 'Password is not correct!'
          }));
        }
      }
    });
  })
  // Token Verify
  app.post('/verifytoken', (req, res) => {
    const token = req.body.token;
    jwt.verify(token, jwtSecret, function(err, decoded) {
      if( err ) {
        if( err.message === 'jwt expired' ) {
          res.send(JSON.stringify({
            code: 'Failed',
            message: 'expired'
          }));
        } else {
          res.send(JSON.stringify({
            code: 'Failed',
            message: 'Invalid Token'
          }));
        }
        return ;
      }
      console.log(decoded);
      res.send(JSON.stringify({
        code: 'Success',
        message: 'Successfully Verified'
      }));
    });
  });
};