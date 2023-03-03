const {sendToAll} = require("../index");
const ticket = require('../models/ticket')
const router = require('express').Router()
router.post("/", async (req, res) => {
    if(!req.body.id) return res.status(400).send("Provide ticket id")
    if(!(await ticket.exists({id:req.body.id}))) return res.status(404).send("Ticket not found")
    await ticket.updateOne({id:req.body.id}, {hasTakenFreeDrink:req.body.hasTakenFreeDrink})
    sendToAll(JSON.stringify({
        "messageType": "sync",
        "scannerName": process.ipToName[req.ip],
        "from": req.body.hasTakenFreeDrink ? "Free drink" : "Removed free drink",
        "fullTicket": await ticket.findOne({id: req.body.id})
    }))
    res.sendStatus(200)
})
module.exports = router