import {getInstance} from "../models";
import {User} from "../models/user";

const jwt = require('jsonwebtoken')

const responseBody = (body, endpoint, code = 200, error = null) => ({
    data: body,
    context: {
        endpoint: `/profile/${endpoint}`,
        status: error ? 'error' : 'success',
        code,
        error
    }
})

export const validate = async (req, res) => {
    try {
        req.user = await jwt.verify(req.token, process.env.JWT_PRIVATE_KEY)
        next()
    } catch (error) {
        res.sendStatus(401).json({"data": "unautorized"})
    }
}

export const me = async (res, req) => {
    const userId = req.user.id
    const userModel = getInstance('User')
    const user = new User(userModel)

    try {
        const loaded = await user.get(userId)

        if (!loaded) {
            req.sendStatus(401).json(responseBody(
                null,
                'profile',
                401,
                {
                    source: 'user',
                    type: 'not_found'
                }
            ))
        }

        req.json(responseBody(
            user.data,
            'profile'
        ))
    } catch (error) {
        req.sendStatus(401).json(responseBody(
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
