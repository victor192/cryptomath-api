const jwt = require('jsonwebtoken')

import {
    Captcha,
    ValidateCaptcha
} from "../models/captcha"
import {
    User
} from "../models/user"
import {getInstance} from "../models"

const AUTH_TOKEN_EXPIRES_IN = 30

const responseBody = (body, endpoint, code = 200, error = null) => ({
    data: body,
    context: {
        endpoint: `/auth/${endpoint}`,
        success: !error,
        code,
        error
    }
})

export const login = async(req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    const userModel = getInstance('User')
    const user = new User(userModel)

    try {
        const [status, error] = await user.login(data)

        if (!status) {
            return res.json(responseBody(
                null,
                'login',
                500,
                {
                    source: 'user',
                    type: error
                }
            ))
        }

        const expiresIn = AUTH_TOKEN_EXPIRES_IN * 60
        const token = await jwt.sign(
            user.data,
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn
            }
        )

        res.json(responseBody(
            {
                accessToken: token,
                expiresIn
            },
            'login'
        ))
    }
    catch (error) {
        res.json(responseBody(
            null,
            'login',
            500,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}

export const register = async (req, res) => {
    const captcha = req.body.captcha
    const data = {
        captcha: {
            token: captcha.token || '',
            answer: captcha.answer || ''
        },
        displayName: req.body.displayName || '',
        email: req.body.email || '',
        password: req.body.password || ''
    }

    try {
        const decoded = await jwt.verify(data.captcha.token, process.env.JWT_PRIVATE_KEY)
        const captchaModel = getInstance('Captcha')
        const validateCaptcha = new ValidateCaptcha(captchaModel, decoded.id)

        const loaded = await validateCaptcha.setData()

        if (!loaded) {
            return res.json(responseBody(
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
            return res.json(responseBody(
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
            return res.json(responseBody(
                null,
                'register',
                500,
                {
                    source: 'user',
                    type: 'already_exist'
                }
            ))
        }

        res.json(responseBody(
            user.data,
            'register'
        ))
    } catch(error) {
        if (error.name === 'TokenExpiredError') {
            res.json(responseBody(
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

            res.json(responseBody(
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
            res.json(responseBody(
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
