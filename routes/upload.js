const router = require('express').Router()
const ticket = require('../models/ticket')
router.post("/initDb", async (req,res) => {
    if(!req.body) return res.sendStatus(400)
    //TODO: process db
    res.send("received")
})
router.post("/enterTickets", async (req, res) => {

})
module.exports = router