const {sendToAll} = require("../index");
const ticket = require('../models/ticket')
const router = require('express').Router()
router.get("/:id", async (req,res)=>{
    sendToAll(JSON.stringify({"messageType": "sync", "scannerName": "dashboard", "from": "Button", "fullTicket": await ticket.findOne({id: req.params.id})}))
    console.log(req.params.id + ": sync successful")
    res.sendStatus(200)
})
module.exports = router