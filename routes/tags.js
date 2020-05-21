const express = require('express')
const router = express.Router()

import {
    all
} from '../controllers/tags'

router.post('/all', all)

export default router
