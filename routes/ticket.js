const router = require('express').Router()
const ticket = require('../models/ticket')
const { sendToAll} = require("../index");

router.post("/editEnterStatus", async (req, res) => {
    if (!req.body) return res.status(400).send("Body of request is necessary")
    if (!req.body.id) return res.status(400).send("The body must contain the ID of the ticket")
    let status = await ticket.updateOne({id: req.body.id}, {
        hasEntered: req.body.setEnter,
        whoScanned: req.body.scannerName,
        'timestamps.entered': Date.now()
    })
    if (!status.matchedCount || status.matchedCount === 0) {
        return res.status(404).send("Ticket not found")
    }
    sendToAll(JSON.stringify({"messageType": "sync", "fullTicket": req.body}))
    res.sendStatus(200)
})

module.exports = router;