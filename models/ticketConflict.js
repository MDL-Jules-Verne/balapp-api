const mongoose = require('mongoose');

const ticket = mongoose.Schema({
    ticket: {
        id:String,
        classe: Number,
        niveau: String,
        prenom: String,
        nom: String,
        externe: Boolean,
        whoEntered: String,
        whoScanned: String,
        hasEntered: {type: Boolean, default: false},
        timestamps:{
            registered: Number,
            entered: Number,
            leave: Number,
        },
        hasTakenFreeDrink: Boolean,
        clothes: [{
            clothType: String,
            idNumber: Number,

            place: Number
        }],
    },
    newTicket:{
        id:String,
        classe: Number,
        niveau: String,
        prenom: String,
        nom: String,
        externe: Boolean,
        whoEntered: String,
        whoScanned: String,
        hasEntered: {type: Boolean, default: false},
        timestamps:{
            registered: Number,
            entered: Number,
            leave: Number,
        },
        hasTakenFreeDrink: Boolean,
        clothes: [{
            clothType: String,
            idNumber: Number,

            place: Number
        }],
    }
})
module.exports = mongoose.model("ticketConflict", ticket);