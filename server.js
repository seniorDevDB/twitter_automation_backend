var express = require("express")
// var socketIo = require("socket.io")
var cors = require("cors")
const path = require('path')
var bodyParser = require("body-parser")

mongodb = require('./db')

var app = express()
var port = process.env.PORT || 5000


app.use(bodyParser.json())
app.use(cors())
router = require('./routes')(app, mongodb)
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(express.static(path.join(__dirname, 'build')))
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// })

// app.listen(5000, () => {
//     console.log("listening ...")
// })

const http = require('http').Server(app);

http.listen(port, () => {
    console.log('Server is running on port:', port);
});