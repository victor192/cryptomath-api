import {getInstance} from "../models";
import {Stats} from "../models/stats";

const responseBody = (
    body,
    endpoint,
    code = 200,
    error = null
) => ({
    data: body,
    context: {
        endpoint: `/stats/${endpoint}`,
        success: !error,
        code,
        error
    }
})

export const general = async (req, res) => {
    const articleModel = getInstance('Article')
    const userModel = getInstance('User')
    const hubModel = getInstance('Hub')
    const tagModel = getInstance('Tag')
    const stats = new Stats({articleModel, userModel, hubModel, tagModel})

    try {
        await stats.setData()

        res.json(responseBody({
                articles: stats.articles,
                users: stats.users,
                hubs: stats.hubs,
                tags: stats.tags
            },
            'general'
        ))
    } catch(error) {
        res.json(responseBody(
            null,
            'general',
            500,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}

export const tags = async (req, res) => {
    const articleModel = getInstance('Article')
    const tagModel = getInstance('Tag')
    const stats = new Stats({articleModel, tagModel})

    try {
        await stats.setRelatedTags()

        res.json(responseBody(
            stats.relatedTags,
            'tags'
        ))
    } catch(error) {
        res.json(responseBody(
            null,
            'tags',
            500,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
