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
    let salles = {
        'A': {'violet': 0, 'bleu': 0, 'vert': 0, 'jaune': 0, 'orange': 0},
        'B': {'violet': 0, 'bleu': 0, 'vert': 0, 'jaune': 0, 'orange': 0},
        'C': {'violet': 0, 'bleu': 0, 'vert': 0, 'jaune': 0, 'orange': 0},
        'D': {'violet': 0, 'bleu': 0, 'vert': 0, 'jaune': 0, 'orange': 0, 'rose': 0},
        'E': {'violet': 0, 'bleu': 0, 'vert': 0, 'jaune': 0, 'orange': 0, 'rose': 0},
        'F': {'violet': 0, 'bleu': 0, 'vert': 0, 'jaune': 0, 'orange': 0, 'rose': 0}
    }
    for (const i of ticketsList){
        salles[i.salle][i.couleur] += 1
    }
    console.log(salles)
}