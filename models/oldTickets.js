const mongoose = require('mongoose');

const ticketOld = mongoose.Schema({
    tickets:[
        {
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
    ],
    date: Date

})
module.exports = mongoose.model("oldTickets", ticketOld);