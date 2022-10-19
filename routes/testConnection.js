const router = require('express').Router()
router.get("/", (req,res)=>{
    res.status(200).send("connection established")
})
module.exports = router