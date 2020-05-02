const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
require('dotenv').config()

import {
    connect as dbConnect,
    close as dbClose
} from './core/database'
import {
    syncronize as syncronizeModels
} from "./models"
import router from './routes'

const port = process.env.PORT || 5000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(router)

app.get('/', (req, res) => {
    res.json({
        data: "I'll blaste you"
    })
})

const stop = (server) => async () => {
    try {
        server.close(async () => {
            await dbClose()

            console.log('CryptoMath API stopped')
        })
    } catch (error) {
       throw new Error(error)
    }
}

const startup = async () => {
    try {
        await dbConnect()
        await syncronizeModels()

        const server = app.listen(port, () => {
            console.log(`CryptoMath API started on port ${port}`)
        })

        process.on('SIGINT', stop(server))
        process.on('SIGTERM', stop(server))
    } catch(error) {
        console.error(error)
    }
}

startup()
