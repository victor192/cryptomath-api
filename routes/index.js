const express = require('express')
const app = express()

import captcha from "./captcha"

app.use('/captcha' , captcha)

export default app
