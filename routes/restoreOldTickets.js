const router = require('express').Router()
const ticket = require('../models/ticket')
const oldTicket = require('../models/oldTickets')
const {arraysToObjects} = require('../utils/arrayToObject')
router.post("/", async (req,res) => {
    if(!req.query.id) return res.status(400).send("Provide id of tickets to restore")
    let ticketsToRestore = await oldTicket.findOne({_id: req.query.id})
    if(!ticketsToRestore) return res.status(404).send("Tickets to restore not found")
    let ticketsToRemove = await ticket.find()
    await oldTicket.create({
        tickets: ticketsToRemove,
        date: Date.now()
    })
    await ticket.deleteMany()
    await ticket.insertMany(ticketsToRestore.tickets)
    await oldTicket.deleteOne({_id: req.query.id})
    res.sendStatus(200)
})
module.exports = router