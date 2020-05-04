const express = require('express')
const app = express()

import captcha from "./captcha"
import auth from "./auth"

app.use('/captcha' , captcha)
app.use('/auth', auth)

export default app
