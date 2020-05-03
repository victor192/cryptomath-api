const jwt = require('jsonwebtoken')

import {Captcha} from "../models/captcha"
import {getInstance} from "../models"

export const generate = async (req, res) => {
    const model = getInstance('Captcha')
    const captcha = new Captcha(model)

    try {
        await captcha.setData()

        if (captcha.loaded) {
            const token = await jwt.sign(captcha.data, process.env.JWT_PRIVATE_KEY, {expiresIn: 15 * 60})
            const math = captcha.math

            res.json({token, math})
        } else {
            res.sendStatus(500)
        }
    } catch (eror) {
        throw new Error(eror)
    }
}
