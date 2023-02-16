const {sendToAll} = require("../index");
const ticket = require('../models/ticket')
const router = require('express').Router()
router.post("/", async (req, res) => {
    if(!req.body.id) return res.status(400).send("Provide ticket id")
    if(!(await ticket.exists({id:req.body.id}))) return res.status(404).send("Ticket not found")
    console.log(req.body.hasTakenFreeDrink)
    await ticket.updateOne({id:req.body.id}, {hasTakenFreeDrink:req.body.hasTakenFreeDrink})
    res.sendStatus(200)
})
module.exports = router