const mongoose = require('mongoose');

const ticketOld = mongoose.Schema({
    tickets:[
        {
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
    ],
    date: Number

})
module.exports = mongoose.model("oldTickets", ticketOld);