const jwt = require('jsonwebtoken')

import {Captcha} from "../models/captcha"

const CAPTCHA_TOKEN_EXPIRES_IN = 15

const responseBody = (
    body,
    endpoint,
    code = 200,
    error = null
) => ({
    data: body,
    context: {
        endpoint: `/captcha/${endpoint}`,
        success: !error,
        code,
        error
    }
})

export const generate = async (req, res) => {
    const captcha = new Captcha()

    try {
        const loaded = await captcha.setData()

        if (!loaded) {
            return res.json(responseBody(
                null,
                'generate',
                500,
                {
                    source: 'captcha',
                    type: 'not_loaded'
                }
            ))
        }

        const token = await jwt.sign(
            captcha.data,
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn: CAPTCHA_TOKEN_EXPIRES_IN * 60
            }
            )
        const math = captcha.math

        res.json(responseBody(
            {token, math},
            'generate',
        ))
    } catch (error) {
        res.json(responseBody(
            null,
            'generate',
            500,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
