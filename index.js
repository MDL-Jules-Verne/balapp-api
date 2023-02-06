const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')
const ticket = require('./models/ticket')
let files =  fs.readdirSync("routes")
let server = require('http').createServer()
let WSServer = require('ws').Server
let wss = new WSServer({
    server: server
})
module.exports = {sendToAll: function (message) {
        wss.clients.forEach((e) => {
            e.send(message)
        })
    }
};
app.use(express.json());

// activate all routes from /routes
app.use((req,res, next)=>{
    // console.log(req.path)
    next()
})
files.forEach((e,i)=>{
    app.use(`/${e.slice(0,e.length-3)}`, require(`./routes/${e}`))
})
//TODD: connect to local database
mongoose.connect(
    "mongodb://127.0.0.1:27017/balapp",
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

const mode = "buy"
server.on("request", app)
wss.on("connection", (socket)=>{
    console.log(`connected:`);
    socket.on("message", async (message)=>{
        let msg = message.toString();
        // console.log(msg);
        if(msg === "hello") {
            socket.send(JSON.stringify({mode, db: await ticket.find()}))
        }
        if(msg === "testConnection"){
            socket.isAlive = true;
        }
        try{
            msg = JSON.parse(msg)
        } catch (e) {
            
        }
        if(msg?.messageType === "updateReceived"){
            console.log(msg.ticket)
        }
    })
})
const interval = setInterval(() => {
    console.log(wss.clients.size)
    wss.clients.forEach((socket) => {
        if(socket.isAlive === false) socket.terminate()
        socket.isAlive = false
        socket.send("testConnection");
    })
}, process.env.DELAY || 1000);

server.listen(2000)