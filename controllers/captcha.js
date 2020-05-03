const jwt = require('jsonwebtoken')

import {Captcha} from "../models/captcha"
import {getInstance} from "../models"

const responseBody = (body, endpoint, code = 200, error = null) => ({
    data: body,
    context: {
        endpoint: `/captcha/${endpoint}`,
        status: error ? 'error' : 'success',
        code,
        error
    }
})

export const generate = async (req, res) => {
    const model = getInstance('Captcha')
    const captcha = new Captcha(model)

    try {
        await captcha.setData()

        if (captcha.loaded) {
            const token = await jwt.sign(captcha.data, process.env.JWT_PRIVATE_KEY, {expiresIn: 15 * 60})
            const math = captcha.math

            res.json(responseBody(
                {token, math},
                'generate',
            ))
        } else {
            res.sendStatus(500)
            res.json(responseBody(
                null,
                'generate',
                500,
                {
                    type: 'model',
                    message: 'Failed to load captcha data'
                }
            ))
        }
    } catch (eror) {
        throw new Error(eror)
    }
}
