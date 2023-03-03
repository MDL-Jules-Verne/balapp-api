const router = require('express').Router()
const ticket = require('../models/ticket')
const ticketConflict = require('../models/ticketConflict')
router.post("/", async (req, res) => {
    if (!req.body) return res.status(400)
    for (const ticket1 of req.body) {
        const ticketDb = await ticket.findOne({id: ticket1.id})
        if (ticketDb == null) {
            await ticketConflict.create({
                ticket: null,
                newTicket: ticket1
            })
            continue
        }

        if ((ticketDb.nom !== "" && ticket1.nom !== "") && (ticketDb.nom !== ticket1.nom || ticketDb.prenom !== ticket1.prenom)) {
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