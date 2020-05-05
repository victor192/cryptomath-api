const express = require('express')
const router = express.Router()

import {
    validate,
    me
} from '../controllers/profile'

router.post('/me', validate, me)

export default router
