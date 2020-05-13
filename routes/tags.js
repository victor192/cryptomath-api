const express = require('express')
const router = express.Router()

import {
    all
} from '../controllers/tags'

router.get('/all', all)

export default router
