const {sendToAll} = require("../index");
const ticket = require('../models/ticket')
const router = require('express').Router()
router.get("/:id", async (req, res) => {
    let ticket1 = await ticket.findOne({id: req.params.id})
    ticket1 = {
        id: ticket1.id,
        salle: ticket1.salle,
        couleur: ticket1.couleur,
        classe: 0,
        niveau: "",
        prenom: "",
        nom: "",
        externe: false,
        whoEntered: "",
        whoScanned: "",
        hasEntered: false,
        timestamps: {
            registered: 0,
            entered: 0,
            leave: 0,
        }
    }
    await ticket.updateOne({id:ticket1.id}, ticket1);
    sendToAll(JSON.stringify({"messageType": "sync", "scannerName": "dashboard", "from": "Button", "fullTicket": ticket1}))
    console.log(req.params.id + ": reset successful")
    res.sendStatus(200)
})
module.exports = router