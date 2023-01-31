const router = require('express').Router()
const ticket = require('../models/ticket')
router.get("/", async (req,res) => {
    res.send(await ticket.find())
})

module.exports = router