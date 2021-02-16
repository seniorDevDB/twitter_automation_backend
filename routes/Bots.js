"use strict";
const cors = require("cors");
const {ObjectId} = require('mongodb'); 

// Models
const BotInfoCollection = require('../models/BotInfoModal');
const ReportCollection = require('../models/ReportModal');
const NewMessageCollection = require('../models/NewMessageModal');
const ReplyCommentCollection = require('../models/ReplyCommentModal');
const CommentCollection = require('../models/CommentModal');
const MessageCollection = require('../models/MessageModal');
const ReplyMessageCollection = require('../models/ReplyMessageModal');

module.exports = (app, db) => {
    app.post("/fetch_all_data", (req, res) => {
        console.log("fetach all data called")
        ReportCollection.find({}).then(report => {
            console.log("report", report)
            NewMessageCollection.find({}).then(new_message => {
                console.log("new-msg", new_message)
                CommentCollection.find({"new_reply": false,"coming_time":""}).then(reply_comment => {
                    res.send(JSON.stringify({
                        code: 'success',
                        report: report[0],
                        new_message: new_message,
                        reply_comment: reply_comment
                    }))
                })
            })
        })
    })

    app.post("/start_bot", (req, res) => {
        console.log("start bot called")
        let bot1_dm1_link = req.body.bot1_msg1
        let bot1_dm2_link = req.body.bot1_msg2
        let bot1_comment_dm_link = req.body.bot1_comment_msg
        let bot2_dm1_link = req.body.bot2_msg1
        let bot2_dm2_link = req.body.bot2_msg2
        let bot2_comment_dm_link = req.body.bot2_comment_msg
        let bot3_dm1_link = req.body.bot3_msg1
        let bot3_dm2_link = req.body.bot3_msg2
        let bot3_comment_dm_link = req.body.bot3_comment_msg
        let username_number = req.body.username_num
        let status = req.body.status

        BotInfoCollection.findOne({}).then(info => {
            if(info === null) {
                BotInfoCollection.create({
                    bot1_dm1_link,
                    bot1_dm2_link,
                    bot1_comment_dm_link,
                    bot2_dm1_link,
                    bot2_dm2_link,
                    bot2_comment_dm_link,
                    bot3_dm1_link,
                    bot3_dm2_link,
                    bot3_comment_dm_link,
                    username_number,
                    status
                }, function(err) {
                    if ( err ) {
                        console.log(err)
                        res.send(JSON.stringify({
                            code: 'failed',
                            message: 'Something went wrong on backend, try again!'
                        }))
                    }
                    else {
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'Successfully inserted into database!'
                        }))
                    }
                });
            }
            else {
                if (info.status == "start") {
                    res.send(JSON.stringify({
                        code: 'failed',
                        message: 'Bot is running now!'
                    }))
                }
                else {
                    //update the status
                    console.log("here is 48", status, info._id, BotInfoCollection)
                    BotInfoCollection.updateOne({"_id": ObjectId(info._id)}, { $set: {"status": status}}, function(err, result){
                        if (err) throw err;
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'Successfully started the bot!'
                        }))
                    })
                }
            }
        })

    })

    app.post("/end_bot", (req, res) => {
        console.log("end bot called")
        let status = req.body.status
        
        BotInfoCollection.findOne({}).then(info => {
            if(info === null) {
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'Bot has not started yet!'
                }))
            }
            else {
                if (info.status == "end"){
                    res.send(JSON.stringify({
                        code: 'failed',
                        message: 'Bot is not running now!'
                    }))
                }
                else {
                    BotInfoCollection.updateOne({_id: ObjectId(info._id)}, { $set: {"status": "end"}}, function(err, result){
                        if (err) throw err;
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'Successfully ended the bot!'
                        }))
                    });
                }
            }
        })
    })

    app.post("/check_dm", (req, res) => {
        console.log("check dm called")
        BotInfoCollection.findOne({}).then(info => {
            if(info === null) {
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'Bot has not started yet!'
                }))
            }
            else {
                console.log("124124")
                BotInfoCollection.updateOne({_id: ObjectId(info._id)}, { $set: {"check_dm_status": true}}, function(err, result){
                    console.log("7111")
                    if (err) throw err;
                    res.send(JSON.stringify({
                        code: 'success',
                        message: 'It has been set true'
                    })) 
                });
            }
        })
    })

    app.post("/display_comment", (req, res) => {
        console.log("comment api called", req.body)
        CommentCollection.find({
            to_username: req.body.username,
            account_username: req.body.account_name,
            bot_number: req.body.bot_number,
            profile: req.body.profile
        }).then(comments => {
            console.log("here is comments", comments)
            if (comments.length == 0) {
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'No comments!'
                }))
            }
            else {
                res.send(JSON.stringify({
                    code: 'success',
                    message: comments
                }))
            }
        })
    })

    app.post("/new_comment", (req, res) => {
        let content = req.body.content
        let username = req.body.username
        let account_username = req.body.account_name
        let bot_number = Number(req.body.bot_number)
        let profile = Number(req.body.profile)
        console.log("here is new msg backedn",req.body)

        ReplyCommentCollection.create({
            username,
            account_username,
            content,
            bot_number,
            profile
        }, function(err) {
            if ( err ) {
                console.log(err)
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'Something went wrong on backend, try again!'
                }))
            }
            else {
                res.send(JSON.stringify({
                    code: 'success',
                    message: 'Successfully inserted into database!'
                }))
            }
        });

    })

    app.post("/display_msg", (req, res) => {
        console.log("dm api called")
        MessageCollection.find({
            username: req.body.username
        }).then(dms => {
            console.log("here is dms", dms)
            if (dms.length == 0) {
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'No messages!'
                }))
            }
            else {
                res.send(JSON.stringify({
                    code: 'success',
                    message: dms
                }))
            }
        })
    })

    app.post("/new_msg", (req, res) => {
        let content = req.body.content
        let username = req.body.username
        let bot_number = Number(req.body.bot_number)
        let profile = Number(req.body.profile)
        console.log("here is new msg backedn",req.body)

        ReplyMessageCollection.create({
            username,
            content,
            bot_number,
            profile
        }, function(err) {
            if ( err ) {
                console.log(err)
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'Something went wrong on backend, try again!'
                }))
            }
            else {
                res.send(JSON.stringify({
                    code: 'success',
                    message: 'Successfully inserted into database!'
                }))
            }
        });

    })
};