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
const UsedLeadCollection = require("../models/UsedLeadModal");
const AccountCollection = require("../models/AccountModal");

module.exports = (app) => {
    app.post("/fetch_all_data", (req, res) => {
        console.log("fetach all data called")
        ReportCollection.find({}).then(report => {
            // console.log("report", report)
            MessageCollection.find({"new_reply": true}).then(new_message => {
                

                var reversed_msg = [];
                for (var i = new_message.length -1; i >=0; i--){
                    reversed_msg.push(new_message[i])
                }
                console.log("neww-msg", reversed_msg.length)

                let msg_result = [];

                for (let msg = 0 ; msg < reversed_msg.length; msg ++){
                    let exist = false;
                    for (let each_msg = 0 ; each_msg < msg_result.length; each_msg ++){
                        if (reversed_msg[msg].username == msg_result[each_msg].username && reversed_msg[msg].account_username == msg_result[each_msg].account_username){
                            exist = true;
                            break;
                        }
                    }
                    if( !exist ) {
                        msg_result.push(reversed_msg[msg]);
                    }
                }
                // console.log("msg result", msg_result.map(i => ({us: i.username, ac: i.account_username })))

                CommentCollection.find({"new_reply": true,}).then(reply_comment => {
                    // console.log("comments, reply", reply_comment)
                    var reversed_comment = [];
                    for (var i = reply_comment.length - 1; i >=0; i--){
                        reversed_comment.push(reply_comment[i])
                    }

                    let comment_result = []
                    for (let msg = 0 ; msg < reversed_comment.length; msg ++){
                        let exist = false;
                        for (let each_msg = 0 ; each_msg < comment_result.length; each_msg ++){
                            if (reversed_comment[msg].to_username == comment_result[each_msg].to_username && reversed_comment[msg].account_username == comment_result[each_msg].account_username){
                                exist = true;
                                break;
                            }
                        }
                        if( !exist ) {
                            comment_result.push(reversed_comment[msg]);
                        }
                    }


                    //get account info
                    AccountCollection.find({}).then(accounts => {
                        //get used leads 
                        UsedLeadCollection.find({}).then(used_lead => {
                            // console.log("used leads", used_lead)
                            res.send(JSON.stringify({
                                code: 'success',
                                report: report,
                                new_message: msg_result,
                                reply_comment: comment_result,
                                used_lead: used_lead,
                                account: accounts
                            }))
                        })
                    })
                })
            })
        })
    })

    app.post("/fetch_dm_data", (req, res) => {   
        console.log("callled fetch dm data")
        MessageCollection.find({"new_reply": true}).then(new_message => {

            var reversed_msg = [];
            for (var i = new_message.length -1; i >=0; i--){
                reversed_msg.push(new_message[i])
            }

            let msg_temp = [];

            for (let msg = 0 ; msg < reversed_msg.length; msg ++){
                for (let each_msg = msg + 1 ; each_msg < reversed_msg.length; each_msg ++){
                    if (reversed_msg[msg].to_username == reversed_msg[each_msg].to_username && reversed_msg[msg].account_username == reversed_msg[each_msg].account_username){
                        msg_temp.push(msg);
                    }
                }
            }

            const msg_result = [];
            for (let msg = 0 ; msg < reversed_msg.length; msg ++) {
                if ( ! msg_temp.includes(msg))
                    msg_result.push(reversed_msg[msg]);
            }

            res.send(JSON.stringify({
                code: 'success',
                new_message: msg_result,
            }))
        })
    })

    app.post("/fetch_comment_data", (req, res) => {
        CommentCollection.find({"new_reply": true,}).then(reply_comment => {
            // console.log("comments, reply", reply_comment)
            var reversed_comment = [];
            for (var i = reply_comment.length - 1; i >=0; i--){
                reversed_comment.push(reply_comment[i])
            }

            let temp = [];
            for (let each = 0 ; each < reversed_comment.length; each ++){
                for (let each_comment = each + 1 ; each_comment < reversed_comment.length; each_comment ++){
                    if (reversed_comment[each].to_username == reversed_comment[each_comment].to_username && reversed_comment[each].account_username == reversed_comment[each_comment].account_username){
                        temp.push(each);
                    }
                }
            }

            const result = [];
            for (let each = 0 ; each < reversed_comment.length; each ++) {
                if ( ! temp.includes(each))
                    result.push(reversed_comment[each]);
            }
            
            res.send(JSON.stringify({
                code: 'success',
                reply_comment: result,
            }))
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
        console.log("here lead", lead_number)
        let lead_type = req.body.lead_type
        let bot_number = req.body.bot_number
        let status = req.body.status
        console.log("inside start function", bot_number)
        if (bot_number == 0) {
            BotInfoCollection.find({}).then(info => {
                let i = 0
                for (var each in info) {
                    console.log("her", each)
                    BotInfoCollection.updateOne({"_id": ObjectId(info[each]._id)}, { $set: {
                        "bot_dm1_link": bot_dm1_link,
                        "bot_dm2_link": bot_dm2_link,
                        "bot_comment_dm_link": bot_comment_dm_link,
                        "lead_number": lead_number,
                        "lead_type": lead_type,
                        "status": status
                    }}, function(err, result){
                        if (err) throw err;
                        if (i == info.length - 1){
                            console.log("1377777")
                            res.send(JSON.stringify({
                                code: 'success',
                                message: 'Successfully started the bot!'
                            }))
                        }
                    })
                    i = i + 1
                }
            })
        }
        else {
            BotInfoCollection.findOne({"bot_number": bot_number}).then(info => {
                console.log(info)
                if(info === null) {
                    BotInfoCollection.create({
                        bot_dm1_link,
                        bot_dm2_link,
                        bot_comment_dm_link,
                        lead_number,
                        lead_type,
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
                        BotInfoCollection.updateOne({"_id": ObjectId(info._id)}, { $set: {"status": status,"lead_number":lead_number}}, function(err, result){
                            if (err) throw err;
                            res.send(JSON.stringify({
                                code: 'success',
                                message: 'Successfully started the bot!'
                            }))
                        })
                    }
                }
            })
        }


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

    app.post("/account_info", (req, res) => {
        console.log("called account info")
        const username = req.body.username;
        const bot_number = req.body.bot_number;
        UsedLeadCollection.find({bot_number: bot_number, username: username}).then(used_leads =>{
            MessageCollection.find({account_username: username,bot_number: bot_number}).then(msgs => {
                CommentCollection.find({account_username: username, bot_number: bot_number}).then(comments => {
                    console.log("used leads", used_leads)
                    res.send(JSON.stringify({
                        code: 'success',
                        used_leads: used_leads,
                        message: msgs,
                        comment: comments
                    }))
                })
            })
        })
    })

    app.post("/display_msg", (req, res) => {
        console.log("dm api called")
        MessageCollection.find({
            username: req.body.username,
            bot_number: req.body.bot_number,
            profile: req.body.profile
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
        CommentCollection.updateOne({"account_username": req.body.account_username, "to_username": req.body.to_username, "bot_number": req.body.bot_number, "profile": req.body.profile, "coming_time": req.body.coming_time}, { $set: {"mark_as_read": true}}, function(err, result){

            if (err) throw err;
            console.log("after err")
            res.send(JSON.stringify({
                code: 'success',
                message: 'Marked as read'
            }))
        })
    })

    app.post("/update_is_marked_dm", (req, res) => {
        console.log("inside updated marked dm", req.body)
        MessageCollection.updateOne({"account_username": req.body.account_username, "username": req.body.username, "bot_number": req.body.bot_number, "profile": req.body.profile, "coming_time": req.body.coming_time}, { $set: {"mark_as_read": true}}, function(err, result){
            if (err) throw err;
            res.send(JSON.stringify({
                code: 'success',
                message: 'Marked as read'
            }))
        })
    })

    //this is to add bots info for the test
    app.post("/save_account", (req, res) =>{
        console.log("INSIDE SAVE ACCOUNT")
        AccountCollection.create({
            username: "@bot6",
            bot_number: 6,
            status: true,
            number_of_tried_leads: 0,
            dm: 0,
            dm_reply: 0,
            dm_expired: 0,
            comment: 0,
            comment_reply: 0,
            follow: 0,
            follow_back: 0
        }, function(err) {
            if (err) throw err;
            res.send(JSON.stringify({
                code: 'success',
                message: 'Saved'
            }))
        });
    })

    //reset report 
    app.post("/reset_report", (req, res) => {
        console.log("here is reset reports")
        ReportCollection.find({}).then(reports => {
            console.log("length", reports.length)
            for(var k=0; k < reports.length; k++) {
                ReportCollection.updateOne({_id: ObjectId(reports[k]._id)}, { $set: {"lead_number": 0, "sent_dm":0, "expired_dm":0,"spintax1_reply":0,"spintax2_reply":0,"sent_comment":0,"expired_comment":0,"comment_reply":0,"follow":0,"follow_back":0}}, function(err, result){
                    if (err) throw err;
                    if (k == (reports.length -1)){
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'It has been set true'
                        })) 
                    }

                });
            }
        })
    })

    //reset accounts
    app.post("/reset_account", (req, res) => {
        console.log("here is reset accounts")
        AccountCollection.find({}).then(accounts => {
            console.log("length", accounts.length)
            for(var k=0; k < accounts.length; k++) {
                AccountCollection.updateOne({_id: ObjectId(accounts[k]._id)}, { $set: {"status": true, "number_of_tried_leads":0, "dm":0,"dm_reply":0,"dm_expired":0,"comment":0,"comment_reply":0,"follow":0,"follow_back":0}}, function(err, result){
                    if (err) throw err;
                    if (k == (accounts.length -1)){
                        res.send(JSON.stringify({
                            code: 'success',
                            message: 'It has been set true'
                        })) 
                    }

                });
            }
        })
    })

};