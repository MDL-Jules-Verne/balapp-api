const mongoose = require('mongoose');

const ticket = mongoose.Schema({
    id:String,
    salle: Number,
    couleur: String,
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
    }
})
module.exports = mongoose.model("ticket", ticket);