const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')
const ticket = require('./models/ticket')
let files =  fs.readdirSync("routes")
let server = require('http').createServer()
let WSServer = require('ws').Server
app.use(express.json());

// activate all routes from /routes
files.forEach((e,i)=>{
    app.use(`/${e.slice(0,e.length-3)}`, require(`./routes/${e}`))
})
//TODD: connect to local database
mongoose.connect(
    "mongodb://localhost:27017/balapp",
    // "mongodb://balapp:7fFeCDS3TlPSHDRn8yAk@45.135.56.131:8586/balapp?authSource=winhalla&readPreference=primary&directConnection=true&ssl=false",
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Connected to database");
    }
);
//mongodb://balapp:7fFeCDS3TlPSHDRn8yAk@45.135.56.131:8586/balapp?authSource=winhalla&readPreference=primary&directConnection=true&ssl=false
let wss = new WSServer({
    server: server
})
const mode = "registerTickets"
server.on("request", app)
wss.on("connection", (socket)=>{
    console.log(`connected:`);
    socket.on("message", async (message)=>{
        console.log(`received: ${message}`);
        socket.send(JSON.stringify({mode, db: await ticket.find()}))
    })
})
server.listen(2000)