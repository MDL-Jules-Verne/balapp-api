const router = require('express').Router()
const ticket = require('../models/ticket')
const locker = require('../models/locker')
const {sendToAll} = require("../index");
router.post("/add", async (req, res) => {
    let lockers = await locker.find()
    lockers = lockers.filter(e => e.closed[req.body.clothType] === false)
    let preferredLockers = lockers.filter(e => req.body.forceLockerNumber.includes(e.idNumber))
    let selectedLocker;
    if (preferredLockers.length > 0) {
        selectedLocker = preferredLockers[0]
    } else {
        selectedLocker = lockers[0]
    }
    let updateObject = {}
    updateObject["usedSpace." + req.body.clothType] = 1

    await locker.updateOne({_id: selectedLocker._id}, {$inc: updateObject})
    await ticket.updateOne({id: req.body.id}, {
        $push: {
            clothes: {
                clothType: req.body.clothType,
                idNumber: selectedLocker.idNumber,
                place: selectedLocker.usedSpace[req.body.clothType] + 1
            }
        }
    })
    let cloth = {
        clothType: req.body.clothType,
        idNumber: selectedLocker.idNumber,
        place: selectedLocker.usedSpace[req.body.clothType] + 1
    }
    res.send(cloth)
    sendToAll(JSON.stringify({
        "messageType": "sync",
        "scannerName": process.ipToName[req.ip],
        "from": `${cloth.idNumber > 4 ? cloth.idNumber % 4 : cloth.idNumber}${cloth.clothType === "Relou" ? "R" : cloth.idNumber <= 4 ? "A" : "B"}${cloth.place < 10 ? "0" : ""}${cloth.place}`,
        "fullTicket": await ticket.findOne({id: req.body.id})
    }))
})
router.post("/remove", async (req, res) => {
    let updateObject = {}
    updateObject["remainingSpace." + req.body.cloth.clothType] = 1

    const ticket1 = await ticket.findOne({id: req.body.id})

    if (req.body.cloth.clothType !== "Sac") {
        let sameTypeClothes = ticket1.clothes.filter(e => e.clothType === req.body.cloth.clothType)
        if (sameTypeClothes.length > 1) {
            updateObject["remainingSpace." + req.body.cloth.clothType] = 0
        }
    }
    let cloth = req.body.cloth
    await ticket.updateOne(
        {id: req.body.id},
        {$pull: {clothes: {_id: ticket1.clothes.find(e => e.clothType === cloth.clothType && e.idNumber === cloth.idNumber && e.place === cloth.place)}}}
    )
    await locker.updateOne(
        {idNumber: req.body.cloth.idNumber},
        {$inc: updateObject}
    )
    res.sendStatus(200)
    sendToAll(JSON.stringify({
        "messageType": "sync",
        "scannerName": process.ipToName[req.ip],
        /*TODO: edit this*/
        "from": `REMOVED: ${cloth.idNumber > 4 ? cloth.idNumber % 4 : cloth.idNumber}${cloth.clothType === "Relou" ? "R" : cloth.idNumber <= 4 ? "A" : "B"}${cloth.place < 10 ? "0" : ""}${cloth.place}`,
        "fullTicket": await ticket.findOne({id: req.body.id})
    }))
})

router.post("/setLastRemove", async (req, res) => {
    await ticket.updateOne({id: req.body.id}, {"timestamps.leave": Date.now()})
})
router.get("/closeLocker/:lockerId/:clothType", async (req, res) => {
    let locker1 = await locker.findOne({idNumber: req.query.idNumber})
    let updateObject = {closed: {}}
    updateObject.closed[req.body.clothType] = !locker1.closed[req.body.clothType]
    await locker.updateOne({idNumber: req.params.idNumber}, updateObject)
})
router.get("/lockersList", async (req, res) => {

    res.send((await locker.find()).map(e => {
        return {
            "displayName": 'Vestiaire ' + e.idNumber, "checked": false
        }
    }))
})
router.get("/lockersListFull", async (req, res) => {
    res.send((await locker.find()).map(e => {
        let locker1 = []
        for (const clothType of ["Vetement", "Sac", "Relou"])
            if (e.usedSpace[clothType] !== 0 || !e.closed[clothType]) locker1.push({
                displayName: 'Vestiaire ' + e.idNumber + " " + clothType,
                checked: !e.closed[clothType]
            })
        return locker1
    }).flat())
})

router.post("/editLockers", async (req, res) => {
    let lockers = await locker.find()
    let currentArrayIndex = 0
    // noinspection ES6MissingAwait
    lockers.forEach(async (e,i)=>{
        let updateObj = {}
        for (const clothType of ["Vetement", "Sac", "Relou"])
            if (e.usedSpace[clothType] !== 0 || !e.closed[clothType]) {
                updateObj[`closed.${clothType}`] = !req.body[currentArrayIndex]
                currentArrayIndex += 1
            }
        await locker.updateOne({_id: e._id}, updateObj)
    })

})
module.exports = router