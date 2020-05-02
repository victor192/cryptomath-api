import {getConnection} from '../core/database'
import {CaptchaModel} from "./captcha"

const models = [
    {
        name: 'captcha',
        model: CaptchaModel
    }
]

const instances = {}

export const syncronize = async () => {
    const db = getConnection()

    models.forEach(async (model) => {
        instances[model.name] = await model.model()
    })

    await db.sync({ force: true })
}

export const getInstance = (name) => instances[name] || false
