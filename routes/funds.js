const express = require('express')
const router = express.Router()

import {
    all
} from '../controllers/funds'

router.get('/all', all)

export default router
