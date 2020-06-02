const express = require('express')
const router = express.Router()

import {
    all
} from '../controllers/stats'

router.get('/all', all)

export default router
