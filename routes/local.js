const router = require('express').Router()

router.get("/testConnection", (req,res)=>{
    res.status(200).send("connection established local")
})
function dumbResponse(req,res){
    console.log("NewIncomingRequest")
    console.log("path:", req.originalUrl)
    console.log("bodyType:", req.body)
    res.sendStatus(200)
}
router.get('/*', dumbResponse)
router.post('/*', dumbResponse)

module.exports = router