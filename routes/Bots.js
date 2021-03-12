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
const AlertCollection = require('../models/AlertModal');

module.exports = (app) => {
    app.post("/fetch_all_data", (req, res) => {
        console.log("fetach all data called")
        ReportCollection.find({}).then(report => {
            console.log("report", report)
            MessageCollection.find({"new_reply": true,}).then(new_message => {
                console.log("new-msg", new_message)
                let msg_temp = [];
                for (let msg = 0 ; msg < new_message.length; msg ++){
                    for (let each_msg = msg + 1 ; each_msg < new_message.length; each_msg ++){
                        if (new_message[msg].to_username == new_message[each_msg].to_username && new_message[msg].account_username == new_message[each_msg].account_username){
                            msg_temp.push(msg);
                        }
                    }
                }

                const msg_result = [];
                for (let msg = 0 ; msg < new_message.length; msg ++) {
                    if ( ! msg_temp.includes(msg))
                        msg_result.push(new_message[msg]);
                }
                console.log("msg result", msg_result)


                CommentCollection.find({"new_reply": true,}).then(reply_comment => {
                    console.log("comments, reply", reply_comment)
                    let temp = [];
                    for (let each = 0 ; each < reply_comment.length; each ++){
                        for (let each_comment = each + 1 ; each_comment < reply_comment.length; each_comment ++){
                            if (reply_comment[each].to_username == reply_comment[each_comment].to_username && reply_comment[each].account_username == reply_comment[each_comment].account_username){
                                temp.push(each);
                            }
                        }
                    }

                    const result = [];
                    for (let each = 0 ; each < reply_comment.length; each ++) {
                        if ( ! temp.includes(each))
                            result.push(reply_comment[each]);
                    }
                    
                    console.log("temmp", result)
                    res.send(JSON.stringify({
                        code: 'success',
                        report: report,
                        new_message: new_message,
                        reply_comment: result
                    }))
                })
            })
        })
    })

    app.post("/check_notification", (req, res) => {
        AlertCollection.findOne({}).then(alert => {
            if (alert === null || (alert.dm == false && alert.comment == false)){
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'No alert'
                }))
            }
            else {
                if (alert.dm == true) {
                    //update the database
                    AlertCollection.updateOne({"_id": ObjectId(alert._id)}, { $set: {"dm": false}}, function(err, result){
                        if (err) throw err;
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'dm'
                        }))
                    })
                }
                else if (alert.comment == true) {
                    AlertCollection.updateOne({"_id": ObjectId(alert._id)}, { $set: {"comment": false}}, function(err, result){
                        if (err) throw err;
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'comment'
                        }))
                    })
                }

            }
        })
    })

    app.post("/start_bot", (req, res) => {
        console.log("start bot called")
        let bot_dm1_link = req.body.bot_msg1
        let bot_dm2_link = req.body.bot_msg2
        let bot_comment_dm_link = req.body.bot_comment_msg
        let lead_number = req.body.lead_number
        let bot_number = req.body.bot_number
        let status = req.body.status
        console.log("inside start function")
        BotInfoCollection.findOne({"bot_number": bot_number}).then(info => {
            console.log(info)
            if(info === null) {
                BotInfoCollection.create({
                    bot_dm1_link,
                    bot_dm2_link,
                    bot_comment_dm_link,
                    lead_number,
                    bot_number,
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
        let bot_number = req.body.bot_number
        
        BotInfoCollection.findOne({"bot_number": bot_number}).then(info => {
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
        let bot_number = req.body.bot_number
        BotInfoCollection.findOne({"bot_number": bot_number}).then(info => {
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

    app.post("/check_comment", (req, res) => {
        console.log("check comment called")
        let bot_number = req.body.bot_number
        BotInfoCollection.findOne({"bot_number": bot_number}).then(info => {
            if(info === null) {
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'Bot has not started yet!'
                }))
            }
            else {
                console.log("124124")
                BotInfoCollection.updateOne({_id: ObjectId(info._id)}, { $set: {"check_comment_status": true}}, function(err, result){
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

    app.post("/check_follow", (req, res) => {
        console.log("check follow back called")
        let bot_number = req.body.bot_number
        BotInfoCollection.findOne({"bot_number": bot_number}).then(info => {
            if(info === null) {
                res.send(JSON.stringify({
                    code: 'failed',
                    message: 'Bot has not started yet!'
                }))
            }
            else {
                console.log("124124")
                BotInfoCollection.updateOne({_id: ObjectId(info._id)}, { $set: {"check_follow_status": true}}, function(err, result){
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
                ReplyCommentCollection.find({
                    username: req.body.username,
                    account_name: req.body.account_name
                }).then(reply_comments => {
                    console.log("344444444", reply_comments)
                    for(let i = 0; i < reply_comments.length; i++) {
                        comments.push(reply_comments[i])
                    }
                    
                    res.send(JSON.stringify({
                        code: 'success',
                        message: comments
                    }))
                })
            }
        })
    })

    app.post("/new_comment", (req, res) => {
        let content = req.body.content
        let username = req.body.username
        let account_name = req.body.account_name
        let bot_number = Number(req.body.bot_number)
        let profile = Number(req.body.profile)
        let previous_content = req.body.previous_content
        let link = req.body.link
        console.log("here is new msg backedn",req.body)

        ReplyCommentCollection.create({
            username,
            account_name,
            coming_time: "",
            content,
            previous_content,
            link,
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
                ReplyMessageCollection.find({
                    username: req.body.username
                }).then(reply_dms => {
                    console.log("344444444", reply_dms)
                    for(let i = 0; i < reply_dms.length; i++) {
                        dms.push(reply_dms[i])
                    }
                    
                    res.send(JSON.stringify({
                        code: 'success',
                        message: dms
                    }))
                })
            }
        })
    })

    app.post("/new_msg", (req, res) => {
        let content = req.body.content
        let username = req.body.username
        let link = req.body.link
        let bot_number = Number(req.body.bot_number)
        let profile = Number(req.body.profile)
        console.log("here is new msg backedn",req.body)

        ReplyMessageCollection.create({
            username,
            coming_time: "",
            content,
            link,
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

    app.post("/update_is_marked", (req, res) => {
        console.log("inside updated marked", req.body)
        CommentCollection.updateOne({"account_username": req.body.account_username, "to_username": req.body.to_username, "bot_number": req.body.bot_number, "profile": req.body.profile, "coming_time": req.body.coming_time, "content": req.body.content}, { $set: {"mark_as_read": true}}, function(err, result){
            console.log("hhhhhhhh")
            if (err) throw err;
            res.send(JSON.stringify({
                code: 'success',
                message: 'Marked as read'
            }))
        })
    })

    app.post("/update_is_marked_dm", (req, res) => {
        console.log("inside updated marked dm", req.body)
        MessageCollection.updateOne({"account_username": req.body.account_username, "username": req.body.username, "bot_number": req.body.bot_number, "profile": req.body.profile, "coming_time": req.body.coming_time, "content": req.body.content}, { $set: {"mark_as_read": true}}, function(err, result){
            console.log("hhhhhhddhh")
            if (err) throw err;
            res.send(JSON.stringify({
                code: 'success',
                message: 'Marked as read'
            }))
        })
    })
};