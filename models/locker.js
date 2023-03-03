const mongoose = require('mongoose');

const locker = mongoose.mongoose.Schema({
    "idNumber": Number,
    "remainingSpace": {
        Relou:Number,
        Sac:Number,
        Vetement: Number,
    },
    "totalSpace": {
        Relou:Number,
        Sac:Number,
        Vetement: Number,
    },
    /*holes: {
        Relou:[Number],
        Sac:[Number],
        Vetement: [Number],
    }*/
    /*"clothesAreas": [
        {
            "spotsUp": Number,
            "coatRacks": Number,
            "spotsDown": Number
        }
    ],
    "bagsAreas": [
        {
            "totalSpots": Number
        },
    ]*/
})
module.exports = mongoose.model("locker", locker);