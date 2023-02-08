const router = require('express').Router()
const ticket = require('../models/ticket')
const {sendToAll, sendToDashboard} = require("../index");
router.get("/ticketInfo/:id", async (req, res) => {
    try {
        if (typeof req.params.id !== "string" || req.params.id.length !== 4){
            return res.status(400).send ({success: false, res: "Invalid QRcode"});

        }
        let verify;
        try {
            verify = await ticket.findOne({id: req.params.id})
        } catch (e) {
            return res.status(400).send({success: false, res: "QRCode not found"})
        }
        if (verify == null) return res.status(404).send({success: false, res: "Ticket not found"})
        else res.send({success: true, res:verify})
    }catch(e){
        console.log(e)
        return res.status(400).send({success: false, res: "Unexpected Error"});
    }
    sendToDashboard(JSON.stringify({messageType: "sync", from:"Scanned", scannerName: process.ipToName[req.ip], fullTicket:{id:req.params.id} }))
})

router.post("/enterTicket", async (req,res) =>{
    if(!req.body) return res.status(400).send("Body of request is necessary")
    if(!req.body.id) return res.status(400).send("The body must contain the ID of the ticket")
    let status = await ticket.updateOne({id: req.body.id}, {
        "nom": req.body.nom.toLowerCase(),
        "prenom": req.body.prenom.toLowerCase(),
        "externe": req.body.externe,
        "classe": req.body.classe,
        "niveau": req.body.niveau,
        "whoEntered": req.body.whoEntered.toLowerCase(),
        "timestamps.registered": Date.now()
    })

    if(!status.matchedCount || status.matchedCount === 0) {
        return res.status(404).send("Ticket not found")
    }
    if(!status.modifiedCount || status.modifiedCount === 0){
        return res.status(500).send("Ticket non modifié")
    }
    res.sendStatus(200);
    sendToAll(JSON.stringify({"messageType": "sync", "scannerName": req.body.whoEntered, "from": "Registered", "fullTicket": req.body}))
})

module.exports = router