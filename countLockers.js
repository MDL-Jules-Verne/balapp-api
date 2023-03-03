const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
const lockers = require('./models/locker')
let files = fs.readdirSync("routes")
let server = require('http').createServer()
let WSServer = require('ws').Server
mongoose.connect(
    "mongodb://127.0.0.1:27017/balapp",
    // "mongodb://balapp:7fFeCDS3TlPSHDRn8yAk@45.135.56.131:8586/balapp?authSource=winhalla&readPreference=primary&directConnection=true&ssl=false",
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Connected to database");
        a()
    }
);

async function a() {
    let ticketsList = await lockers.find()
    let niveaux = []
    ticketsList.forEach((e,i)=>{
        niveaux.push({idNumber: e.idNumber})
        console.log(e)
        for (const type of ["Sac", "Vetement", "Relou"]){
            niveaux[i][type] = e["remainingSpace"][type]
        }
    })
    console.log(niveaux)
}