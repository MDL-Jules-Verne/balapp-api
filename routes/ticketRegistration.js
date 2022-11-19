const router = require('express').Router()
const ticket = require('../models/ticket')
router.get("/ticketInfo/:id", async (req, res) => {
    if (typeof req.params.id === "string" || req.params.id.length !== 4)
        return res.status(400).send({success: false, res: "Invalid QRcode"});
    let verify;
    try {
        verify = ticket.findOne({id: req.params.id})
    } catch (e) {
        return res.status(400).send({success: false, res: "Invalid QRcode"})
    }
    if (verify == null) return res.status(404).send({success: false, res: "Ticket not found"})
    else res.send({success:true, res:verify})
})


module.exports = router