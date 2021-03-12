const mongoose = require('mongoose')

// Connection URI
//const uri = "mongodb+srv://wang:lasQ7q350LVsRQWm@cluster0.asfo1.mongodb.net/peachly_twitter_bots?authSource=admin&replicaSet=atlas-4jftde-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
const uri = "mongodb+srv://wang:lasQ7q350LVsRQWm@cluster0.asfo1.mongodb.net/p_twitter_bots?authSource=admin&replicaSet=atlas-4jftde-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log("DB Connected:");
    })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db

