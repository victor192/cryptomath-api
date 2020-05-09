import {
    CaptchaModel,
    CaptchaDefaults
} from "./captcha"
import {
    UserModel,
    UserDefaults
} from "./user"
import {
    FundModel,
    FundDefaults
} from "./fund"
import {
    ArticleDefaults,
    ArticleModel
} from "./article"
import {
    HubModel,
    HubDefaults
} from "./hub";
import {
    TagModel,
    TagDefaults
} from "./tag";
import {
    outputLog,
    outputWarning
} from "../utils/console"

const models = [
    {
        create: CaptchaModel,
        defaults: CaptchaDefaults
    },
    {
        create: UserModel,
        defaults: UserDefaults
    },
    {
        create: FundModel,
        defaults: FundDefaults
    },
    {
        create: ArticleModel,
        defaults: ArticleDefaults
    },
    {
        create: HubModel,
        defaults: HubDefaults
    },
    {
        create: TagModel,
        defaults: TagDefaults
    }
]

const instances = {}
const SYNC_FORCE = true

export const syncronize = () => {
    if (SYNC_FORCE) {
        outputWarning('Sync force mode is enabled')
    }

    try {
        models.forEach(async (modelObject) => {
            const model = modelObject.create()
            outputLog(`Model '${model.name}' has been created`)

            await model.sync({force: SYNC_FORCE})
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
