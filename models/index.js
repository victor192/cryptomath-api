import {
    CaptchaModel,
    CaptchaDefaults
} from "./captcha"
import {
    outputLog
} from "../utils/console"

const models = [
    {
        create: CaptchaModel,
        defaults: CaptchaDefaults
    }
]

const instances = {}

export const syncronize = () => {
    try {
        models.forEach(async (modelObject) => {
            const model = modelObject.create()
            outputLog(`Model '${model.name}' has been created`)

            await model.sync()
            outputLog(`Model '${model.name}' has been synced`)

            if (typeof(modelObject.defaults) === 'function') {
                await modelObject.defaults(model)
                outputLog(`Load defaults for model '${model.name}'`)
            }

            instances[model.name] = model
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const getInstance = (name) => {
    return instances[name] || false
}
