const express = require('express')
const jwt = require('jsonwebtoken')

const port = 5000
const app = express()

app.get('/', (req, res) => {
    res.json({
        data: "I'll blaste you"
    })
})

app.listen(port, () => {
    console.log(`CryptoMath API started on port ${port}`)
})
