const express = require('express')
const app = express()
const mongoose = require('mongoose')
const fs = require('fs')
let files =  fs.readdirSync("routes")

app.use(express.json());

// activate all routes from /routes
files.forEach((e,i)=>{
    app.use(`/${e.slice(0,e.length-3)}`, require(`./routes/${e}`))
})
//TODD: connect to a different database if it's the local server
mongoose.connect(
    "mongodb://balapp:7fFeCDS3TlPSHDRn8yAk@45.135.56.131:8586/balapp?authSource=winhalla&readPreference=primary&directConnection=true&ssl=false",
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Connected to database");
    }
);
//mongodb://balapp:7fFeCDS3TlPSHDRn8yAk@45.135.56.131:8586/balapp?authSource=winhalla&readPreference=primary&directConnection=true&ssl=false

app.listen(2000)