const express = require('express')
const router = express.Router()

import {generate} from '../controllers/captcha'

router.get('/generate', generate)

export default router
