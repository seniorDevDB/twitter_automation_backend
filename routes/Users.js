"use strict";
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

    app.post("/login", (req, res) => {
        console.log("login called from frontend");
        UserCollection.findOne({"email": req.body.email}).then(user => {
            if (user && user.length != 0) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    console.log("password mathces")
                    let token = jwt.sign(user.email, process.env.SECRET_KEY);
                    console.log("here is token", token)
                    res.send({token: token})
                }
                else {
                    console.log("incorrect password");
                    res.json({ error: "Password is not correct" });
                }
            }
            else {
                console.log("does not exist");
                res.json({ error: "User does not exist" });
            }
        })
    })
};