const express = require('express')
const bearerToken = require('express-bearer-token')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

import {
    connect as dbConnect,
    close as dbClose
} from './core/database'
import {
    syncronize as syncronizeModels
} from "./models"
import {
    loadTasks as loadCaptchaTasks
} from "./captcha";
import {
    outputLog,
    outputError
} from "./utils/console"
import router from './routes'

const port = process.env.PORT || 5000
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bearerToken())
app.use(cors())
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

            outputLog('CryptoMath API stopped')
        })
    } catch (error) {
       throw new Error(error)
    }
}

const startup = async () => {
    try {
        await dbConnect()
        await loadCaptchaTasks()
        await syncronizeModels()

        const server = app.listen(port, () => {
            outputLog(`CryptoMath API started on port ${port}`)
        })

        process.on('SIGINT', stop(server))
        process.on('SIGTERM', stop(server))
    } catch(error) {
        outputError(error)
    }
}

startup()
