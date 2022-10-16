const mongoose = require('mongoose');

const ticket = mongoose.Schema({
    ticket: {
        id:String,
        salle: Number,
        couleur: String,
        prenom: String,
        nom: String,
        externe: Boolean,
        whoEntered: String,
        hasEntered: {type: Boolean, default: false},
        timestamps:{
            registered: Number,
            entered: Number,
            leave: Number,
        }
    },
    newTicket:{
        id:String,
        salle: Number,
        couleur: String,
        prenom: String,
        nom: String,
        externe: Boolean,
        whoEntered: String,
        hasEntered: {type: Boolean, default: false},
        timestamps:{
            registered: Number,
            entered: Number,
            leave: Number,
        }
    }
})
module.exports = mongoose.model("ticketConflict", ticket);