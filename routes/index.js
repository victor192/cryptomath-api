const express = require('express')
const app = express()

import captcha from "./captcha"
import auth from "./auth"
import profile from "./profile"
import articles from "./articles"

app.use('/captcha' , captcha)
app.use('/auth', auth)
app.use('/profile', profile)
app.use('/articles', articles)

export default app
