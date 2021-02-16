const mongoose = require('mongoose')

// Connection URI
const uri = "mongodb+srv://wang:lasQ7q350LVsRQWm@cluster0.asfo1.mongodb.net/peachly_twitter_bots?authSource=admin&replicaSet=atlas-4jftde-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
const database_name = "peachly_twitter_bots"

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

