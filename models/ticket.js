const mongoose = require('mongoose');

const ticket = mongoose.mongoose.Schema({
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
})
module.exports = mongoose.model("ticket", ticket);