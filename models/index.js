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
    ArticleAssociations,
    ArticleDefaults,
    ArticleHubDefaults,
    ArticleTagDefaults,
    ArticleHubModel,
    ArticleTagModel,
    ArticleModel,
    ArticleAnswerModel,
    ArticleVoteModel
} from "./article"
import {
    HubModel,
    HubDefaults
} from "./hub";
import {
    TagAssociations,
    TagModel,
    TagDefaults
} from "./tag";
import {
    outputLog,
    outputWarning
} from "../utils/console"
import {getConnection} from "../core/database";

const models = [
    {
        create: CaptchaModel
    },
    {
        create: UserModel
    },
    {
        create: FundModel,
    },
    {
        create: HubModel
    },
    {
        create: TagModel
    },
    {
        create: ArticleModel
    },
    {
        create: ArticleHubModel
    },
    {
        create: ArticleTagModel
    },
    {
        create: ArticleAnswerModel
    },
    {
        create: ArticleVoteModel
    }
]

const associations = [
    {
        model: 'Tag',
        associate: TagAssociations
    },
    {
        model: 'Article',
        associate: ArticleAssociations
    }
]

const defaults = [
    {
        model: 'Captcha',
        create: CaptchaDefaults
    },
    {
        model: 'User',
        create: UserDefaults
    },
    {
        model: 'Fund',
        create: FundDefaults
    },
    {
        model: 'Hub',
        create: HubDefaults
    },
    {
        model: 'Tag',
        create: TagDefaults
    },
    {
        model: 'Article',
        create: ArticleDefaults
    },
    {
        model: 'ArticleHub',
        create: ArticleHubDefaults
    },
    {
        model: 'ArticleTag',
        create: ArticleTagDefaults
    }
]

const instances = {}
const SYNC_FORCE = true

export const create = () => {
    try {
        models.forEach(modelObject => {
            const model = modelObject.create()
            outputLog(`Model '${model.name}' has been created`)

            instances[model.name] = model
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const associate = () => {
    try {
        associations.forEach((associationObject) => {
            const model = getInstance(associationObject.model)

            associationObject.associate(model)
            outputLog(`Created associations for model '${associationObject.model}'`)
        })
    } catch (error) {
        throw new Error(error)
    }
}

const loadDefaults = () => {
    try {
        defaults.forEach(async (defaultObject) => {
            const model = getInstance(defaultObject.model)

            await defaultObject.create(model)
            outputLog(`Load defaults for model '${model.name}'`)
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const synchronize = async () => {
    if (SYNC_FORCE) {
        outputWarning('Sync force mode is enabled')
    }

    const db = getConnection()

    try {
        await db.sync({ force: SYNC_FORCE })
        outputLog('All models has been synced')

        loadDefaults()
    } catch (error) {
        throw new Error(error)
    }
}

export const getInstance = (name) => {
    return instances[name] || false
}
