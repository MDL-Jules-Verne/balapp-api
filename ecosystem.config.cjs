module.exports = {
    apps : [{
        name   : "Balapp",
        script : "./index.js",
        env: {
            "MODE": "buy",
            "DELAY": "900",
            "PROD": "true",
        }
    }]
}
