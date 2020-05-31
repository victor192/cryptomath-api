const express = require('express')
const app = express()

import captcha from "./captcha"
import auth from "./auth"
import profile from "./profile"
import articles from "./articles"
import hubs from "./hubs"
import tags from "./tags"
import stats from "./stats"
import organizations from "./organizations"

app.use('/captcha' , captcha)
app.use('/auth', auth)
app.use('/profile', profile)
app.use('/articles', articles)
app.use('/hubs', hubs)
app.use('/tags', tags)
app.use('/stats', stats)
app.use('/organizations', organizations)

export default app
