const express = require('express')
const router = express.Router()

import {
    general
} from '../controllers/stats'

router.get('/general', general)

export default router