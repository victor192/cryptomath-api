import {getInstance} from "../models";
import {User} from "../models/user";

const jwt = require('jsonwebtoken')

const responseBody = (
    body,
    endpoint,
    code = 200,
    error = null
) => ({
    data: body,
    context: {
        endpoint: `/profile/${endpoint}`,
        success: !error,
        code,
        error
    }
})

export const validate = async (req, res, next) => {
    try {
        res.locals.user = await jwt.verify(req.token, process.env.JWT_PRIVATE_KEY)
        return next()
    } catch (error) {
        return res.sendStatus(401)
    }
}

export const me = async (req, res) => {
    const userId = res.locals.user.id
    const userModel = getInstance('User')
    const user = new User(userModel)

    try {
        const loaded = await user.get(userId)

        if (!loaded) {
            return res.sendStatus(401).json(responseBody(
                null,
                'profile',
                401,
                {
                    source: 'user',
                    type: 'not_found'
                }
            ))
        }

        res.json(responseBody(
            user.data,
            'profile'
        ))
    } catch (error) {
        res.sendStatus(401).json(responseBody(
            null,
            'profile',
            401,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
