const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
const ticket = require('./models/ticket')
let files =  fs.readdirSync("routes")
let server = require('http').createServer()
let WSServer = require('ws').Server
let wss = new WSServer({
    server: server
})
app.use(cors())
process.ipToName = {}
module.exports = {sendToAll: function (message) {
        wss.clients.forEach((e) => {
            e.send(message)
        })
    }, sendToDashboard: function (message){
        wss.clients.forEach((e) => {
            if(e.name === "dashboard") e.send(message)
        })
    }
};
app.use(express.json());

// activate all routes from /routes
app.use((req,res, next)=>{
    next()
})
files.forEach((e,i)=>{
    app.use(`/${e.slice(0,e.length-3)}`, require(`./routes/${e}`))
})
app.get('/dashboard', async (req,res)=>{
    res.send(fs.readFileSync("dashboard.html", {encoding:"utf-8"}))
})
app.get('/inter.css', async (req,res)=>{
    res.setHeader("Content-Type", "text/css").send(fs.readFileSync("inter.css", {encoding:"utf-8"}))
})
app.get('/tailwind.js', async (req,res)=>{
    res.send(fs.readFileSync("tailwind.js", {encoding:"utf-8"}))
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

const mode = "bal"
server.on("request", app)
let dashboardSocket;
wss.on("connection", (socket, req)=>{
    socket.on("close", ()=>{
        let allSocketsList = []
        wss.clients.forEach(e=>{
            if(e.name !== "dashboard") allSocketsList.push(e.name)
        })
        dashboardSocket?.send(JSON.stringify({"messageType": "disconnect","scannerName": socket.name, "allSockets": allSocketsList}))
    })
    socket.on("message", async (message)=>{
        let msg = message.toString();
        // console.log(msg);

        if(msg === "dashboardConnect"){
            socket.name = "dashboard"
            dashboardSocket = socket;
        }
        if(msg === "hello") {
            socket.send(JSON.stringify({mode, db: await ticket.find()}))
        }
        if(msg.startsWith("name")){
            process.ipToName[req.socket.remoteAddress] = msg.slice(4)
            socket.name = msg.slice(4)
        }
        if(msg === "testConnection"){
            socket.isAlive = 1;

            let allSocketsList = []
            wss.clients.forEach(e=>{
                if(e.name !== "dashboard") allSocketsList.push(e.name)
            })
            dashboardSocket?.send(JSON.stringify({"messageType": "heartbeat", "scannerName": socket.name, "allSockets": allSocketsList}));
        }
        try{
            msg = JSON.parse(msg)
        } catch (e) {
            
        }
        if(msg?.messageType === "updateReceived"){
            console.log("updateReceived: " + socket.name)
        }
    })
})

const interval = setInterval(() => {
    wss.clients.forEach((socket) => {
        if(socket.name === "dashboard") return;
        socket.send("testConnection")
        // console.log(socket.isAlive);
        if(socket.isAlive === 4) {
            console.log(socket.name+ ": TERMINATE CONNECTION")
            socket.terminate()
        }
        if(!socket.isAlive) socket.isAlive = 1
        socket.isAlive += 1;
    })
}, process.env.DELAY || 900);

server.listen(2000, ()=>{
    console.log("Connect to http://localhost:2000/dashboard to see dashboard")
})