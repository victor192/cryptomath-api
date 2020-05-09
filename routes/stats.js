const express = require('express')
const router = express.Router()

import {
    general,
    tags
} from '../controllers/stats'

router.get('/general', general)
router.get('/tags', tags)

export default router
