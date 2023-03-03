const router = require('express').Router()
const ticket = require('../models/ticket')
const locker = require('../models/locker')
const {sendToAll} = require("../index");
router.post("/add", async (req, res) => {
    let lockers = await locker.find()
    lockers = lockers.filter(e=>e.remainingSpace[req.body.clothType] > 0)
    console.log(req.body.forceLockerNumber)
    let max;
    /*let max = lockers.reduce((prev, current) => (prev.remainingSpace[req.body.clothType] > current.remainingSpace[req.body.clothType]) ? prev : current);
    if (max.remainingSpace[req.body.clothType] <= 0) {
        lockers = await locker.find({idNumber: {$in: req.body.forceLockerNumber.map(e => e + 4)}})
        max = lockers.reduce((prev, current) => (prev.remainingSpace[req.body.clothType] > current.remainingSpace[req.body.clothType]) ? prev : current);
        if (max.remainingSpace[req.body.clothType] <= 0)
            return res.status(400).send("Plus d'espace")
    }*/
    if(req.body.clothType === "Vetement"){
        max = lockers.filter(e=>req.body.forceLockerNumber.includes(e.idNumber))
        console.log(max)
        if(max.length === 0){
            max = lockers.filter(e=>req.body.forceLockerNumber.includes(e.idNumber-4))
        }
    } else if(req.body.clothType === "Relou"){
        max = lockers.filter(e=>req.body.forceLockerNumber.includes(e.idNumber))
    } else if(req.body.clothType === "Sac"){
        max = [lockers.find(e=>e.idNumber === 4)]
        if(max[0] === undefined){
            max = lockers.filter(e=>[5,6,7].includes(e.idNumber));
            if(max.length === 0){
                max = lockers.filter(e=>[1,2,3].includes(e.idNumber));
            }
        }
    }
    if(max.length === 0) return res.status(400).send("Plus d'espace");
    else max = max[0]

    let updateObject = {}
    updateObject["remainingSpace." + req.body.clothType] = -1
    const ticket1 = await ticket.findOne({id: req.body.id})
    let place = max.totalSpace[req.body.clothType] + 1 - max.remainingSpace[req.body.clothType]
    let idNumber = max.idNumber

    if (req.body.clothType !== "Sac") {
        let sameTypeClothes = ticket1.clothes.filter(e => e.clothType === req.body.clothType)
        if (sameTypeClothes.length > 0) {
            idNumber = sameTypeClothes[0].idNumber;
            place = sameTypeClothes[0].place;
            updateObject["remainingSpace." + req.body.clothType] = 0
        }
    }
    /*let removeHoles
    if(max.holes[req.body.clothType].length > 0) {

    }*/

    await locker.updateOne({_id: max._id}, {$inc: updateObject})
    await ticket.updateOne({id: req.body.id}, {
        $push: {
            clothes: {
                clothType: req.body.clothType,
                idNumber: idNumber,
                place: place
            }
        }
    })
    let cloth = {
        clothType: req.body.clothType,
        idNumber: idNumber,
        place: place
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
        "from": `REMOVED: ${cloth.idNumber > 4 ? cloth.idNumber % 4 : cloth.idNumber}${cloth.clothType === "Relou" ? "R" : cloth.idNumber <= 4 ? "A" : "B"}${cloth.place < 10 ? "0" : ""}${cloth.place}`,
        "fullTicket": await ticket.findOne({id: req.body.id})
    }))
})

router.post("/setLastRemove", async (req, res) => {
    await ticket.updateOne({id: req.body.id}, {"timestamps.leave": Date.now()})
})
router.get("/lockersList", async (req, res) => {
    res.send((await locker.find({idNumber: {$lte: 3}})).map(e => 'Vestiaire ' + e.idNumber))
})
module.exports = router