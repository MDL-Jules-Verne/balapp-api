const mongoose = require('mongoose');

const locker = mongoose.mongoose.Schema({
    idNumber: Number,
    usedSpace: {
        Relou: Number,
        Sac: Number,
        Vetement: Number,
    },
    closed: {
        Relou: Boolean,
        Sac: Boolean,
        Vetement: Boolean,
    }
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