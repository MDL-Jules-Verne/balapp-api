const router = require('express').Router()
const ticket = require('../models/ticket')
const locker = require('../models/locker')
router.post("/add", async (req, res) => {
    const lockers = await locker.find()
    const max = lockers.reduce((prev, current) => (prev.remainingSpace[req.body.clothType] > current.remainingSpace[req.body.clothType]) ? prev : current);
    if (max.remainingSpace[req.body.clothType] <= 0) {
        return res.status(400).send("Plus d'espace")
    }
    //TODO: tenir compte des vestiaires mobiles (> 4)
    let updateObject = {}
    updateObject["remainingSpace." + req.body.clothType] = -1
    await locker.updateOne({_id: max._id}, {$inc: updateObject})
    await ticket.updateOne({id: req.body.id}, {
        $push: {
            clothes: {
                clothType: req.body.clothType,
                idNumber: max.idNumber,
                place: max.totalSpace[req.body.clothType]+1 - max.remainingSpace[req.body.clothType]
            }
        }
    })
    res.send({
        clothType: req.body.clothType,
        idNumber: max.idNumber,
        place: max.totalSpace[req.body.clothType]+1 - max.remainingSpace[req.body.clothType]
    })
})
router.post("/remove", async (req, res) => {
    let updateObject = {}
    updateObject["remainingSpace." + req.body.cloth.clothType] = 1
    await locker.updateOne(
        {idNumber: req.body.cloth.idNumber},
        {$inc: updateObject}
    )
    await ticket.updateOne({id: req.body.id}, {$pull: {clothes: req.body.cloth}})
    res.sendStatus(200)
})

router.get("/lockersList", async (req, res) => {
    res.send((await locker.find({idNumber: {$lte: 3}})).map(e=>'Vestiaire '+e.idNumber))
})
module.exports = router