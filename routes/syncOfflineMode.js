const router = require('express').Router()
const ticket = require('../models/ticket')
const ticketConflict = require('../models/ticketConflict')
router.post("/", async (req, res) => {
    if (!req.body) return res.status(400)
    console.log(req.body);
    for (const ticket1 of req.body) {
        const ticketDb = await ticket.findOne({id: ticket1.id})
        if (ticketDb == null) {
            await ticketConflict.create({
                ticket: null,
                newTicket: ticket1
            })
            continue
        }
        console.log(ticketDb, ticketDb.nom !== "", ticket1, ticket1.nom !== "")
        if (ticketDb.nom !== "" && ticket1.nom !== "") {
            await ticketConflict.create(
                {
                    ticket: ticketDb,
                    newTicket: ticket1,
                }
            )
        } else {
            await ticket.updateOne({id: ticket1.id}, ticket1)
        }
    }
    res.sendStatus(200);
})

module.exports = router