const router = require('express').Router()
const ticket = require('../models/ticket')

router.post("/editEnterStatus", async (req,res) => {
    if(!req.body) return res.status(400).send("Body of request is necessary")
    if(!req.body.id) return res.status(400).send("The body must contain the ID of the ticket")
    let status = await ticket.updateOne({id: req.body.id}, {hasEntered: req.body.setEnter, whoScanned: req.body.scannerName})
    if(!status.matchedCount || status.matchedCount === 0) {
        return res.status(404).send("Ticket not found")
    }
    res.sendStatus(200)
})

module.exports = router;