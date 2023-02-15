const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
const ticket = require('./models/ticket')
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
    let ticketsList = await ticket.find()
    ticketsList = ticketsList.filter(e=>e.nom !== "")
    let niveaux = {
        '2nde': 0,
        'Premiere': 0,
        'dontPSTMG': 0,
        'Terminale': 0,
        'dontTSTMG':0,
        'externes': 0
    }
    for (const i of ticketsList){
        if(i.externe === true){
            niveaux["externes"] ++
            continue;
        }
        if(i.niveau.startsWith("2")) niveaux["2nde"] ++
        else if(i.niveau.startsWith("P")) niveaux["Premiere"] ++
        else if(i.niveau.startsWith("T")) niveaux["Terminale"] ++
        if(i.niveau === "PSTMG") niveaux["dontPSTMG"] ++
        else if(i.niveau === "TSTMG") niveaux["dontTSTMG"] ++
    }
    console.log(niveaux)
}