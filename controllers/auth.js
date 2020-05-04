const jwt = require('jsonwebtoken')

import {
    Captcha,
    ValidateCaptcha
} from "../models/captcha"
import {
    User
} from "../models/user"
import {getInstance} from "../models"

const responseBody = (body, endpoint, code = 200, error = null) => ({
    data: body,
    context: {
        endpoint: `/auth/${endpoint}`,
        status: error ? 'error' : 'success',
        code,
        error
    }
})

export const login = async(res, req) => {

}

export const register = async (res, req) => {
    const captcha = res.body.captcha
    const data = {
        captcha: {
            token: captcha.token || '',
            answer: captcha.answer || ''
        },
        displayName: res.body.displayName || '',
        email: res.body.email || '',
        password: res.body.password || ''
    }

    try {
        const decoded = await jwt.verify(data.captcha.token, process.env.JWT_PRIVATE_KEY)
        const captchaModel = getInstance('Captcha')
        const validateCaptcha = new ValidateCaptcha(captchaModel, decoded.id)

        const loaded = await validateCaptcha.setData()

        if (!loaded) {
            return req.json(responseBody(
                null,
                'register',
                500,
                {
                    source: 'captcha',
                    type: 'not_loaded'
                }
            ))
        }

        if (!validateCaptcha.validate(decoded.params, data.captcha.answer)) {
            return req.json(responseBody(
                null,
                'register',
                500,
                {
                    source: 'captcha',
                    type: 'wrong_answer'
                }
            ))
        }

        const userModel = getInstance('User')
        const user = new User(userModel)

        const created = await user.create({
            displayName: data.displayName,
            email: data.email,
            password: data.password
        })

        if (!created) {
            return req.json(responseBody(
                null,
                'register',
                500,
                {
                    source: 'user',
                    type: 'already_exist'
                }
            ))
        }

        req.json(responseBody(
            user.data,
            'register'
        ))
    } catch(error) {
        if (error.name === 'TokenExpiredError') {
            req.json(responseBody(
                null,
                'register',
                500,
                {
                    source: "token",
                    type: "expired"
                }
            ))
        }
        else if (error.name === 'SequelizeValidationError') {
            const item = error.errors[0]

            req.json(responseBody(
                null,
                'register',
                500,
                {
                    source: item.path,
                    type: 'invalid'
                }
            ))
        }
        else {
            req.json(responseBody(
                null,
                'register',
                500,
                {
                    source: 'internal',
                    type: 'exception',
                    message: error.message
                }
            ))
        }
    }
}
