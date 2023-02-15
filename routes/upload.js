const router = require('express').Router()
const ticket = require('../models/ticket')
const oldTicket = require('../models/oldTickets')
const ticketConflict = require('../models/ticketConflict')
const {arraysToObjects} = require('../utils/arrayToObject')
router.post("/initDb", async (req, res) => {
    if (!req.body) return res.sendStatus(400)
    let ticketsToAdd = arraysToObjects(req.body.data, req.body.firstLine)
    let oldTickets = await ticket.find()
    if (oldTickets.length > 0) {
        await oldTicket.create({
            tickets: oldTickets,
            date: Date.now()
        })
    }
    await ticket.deleteMany()
    await ticket.insertMany(ticketsToAdd);
    res.sendStatus(200)
})
router.post("/addTickets", async (req, res) => {
    if (!req.body) return res.sendStatus(400)
    let query = []
    req.body.forEach((e) => {
        query.push({id: e.id})
    })
    if(query.length <= 0) return res.sendStatus(200)
    let ticketsToEdit = await ticket.find({$or: query})
    // Will collect promises to run them in parallel
    let updatesInProgress = []
    // noinspection ES6MissingAwait
    ticketsToEdit.forEach(async (e, i) => {
        let newValue = req.body.find(ee => ee.id === e.id)
        if (e.nom === newValue.nom) return
        if (e.nom !== "") {
            updatesInProgress.push(ticketConflict.create({
                ticket: e,
                newTicket: newValue
            }))
        } else {
            updatesInProgress.push(
                ticket.updateOne({id: e.id}, {
                    prenom: newValue.prenom,
                    nom: newValue.nom,
                    externe: newValue.externe,
                    whoEntered: newValue.whoEntered,
                    "timestamps.registered": newValue.timestamps.registered
                })
            )
        }
    })
    // if no await it doesn't work
    for (const e of updatesInProgress) {
        await e
    }
    res.sendStatus(200)
})
module.exports = router