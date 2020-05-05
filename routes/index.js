const express = require('express')
const app = express()

import captcha from "./captcha"
import auth from "./auth"
import profile from "./profile"

app.use('/captcha' , captcha)
app.use('/auth', auth)
app.use('/profile', profile)

export default app
