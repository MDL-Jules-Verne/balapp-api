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
app.use((req,res, next)=>{
    console.log(req.path)
    next()
})
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
const mode = "bal"
server.on("request", app)
wss.on("connection", (socket)=>{
    console.log(`connected:`);
    socket.on("message", async (message)=>{
        let msg = message.toString();
        if(msg === "hello") {
            socket.send(JSON.stringify({mode, db: await ticket.find()}))
        }
        if(msg === "testConnection"){
            socket.isAlive = true;
        }
    })
})
const interval = setInterval(() => {
    console.log(wss.clients.size)
    wss.clients.forEach((socket) => {
        if(socket.isAlive === false && process.env.PROD === true) socket.terminate()
        socket.isAlive = false
        socket.send("testConnection");

    })
}, process.env.DELAY);

server.listen(2000)