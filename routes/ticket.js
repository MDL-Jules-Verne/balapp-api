const router = require('express').Router()
const ticket = require('../models/ticket')
const {sendToAll,} = require("../index");

router.post("/editEnterStatus", async (req, res) => {
    if (!req.body) return res.status(400).send("Body of request is necessary")
    if (!req.body.id) return res.status(400).send("The body must contain the ID of the ticket")
    let status = await ticket.updateOne({id: req.body.id}, {
        hasEntered: req.body.setEnter,
        whoScanned: req.body.scannerName,
        'timestamps.entered': Date.now(),
        nom: req.body.nom,
        prenom: req.body.prenom,
    })
    if (!status.matchedCount || status.matchedCount === 0) {
        return res.status(404).send("Ticket not found")
    }
    res.sendStatus(200)
    sendToAll(JSON.stringify({
        "messageType": "sync",
        "scannerName": !req.body.scannerName ? process.ipToName[req.ip] : req.body.scannerName,
        "from": req.body.setEnter ? "Entered" : "UNentered",
        "fullTicket": await ticket.findOne({id: req.body.id})
    }))
})

module.exports = router;