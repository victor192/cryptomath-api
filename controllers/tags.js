import {Tags} from "../models/tag"

const TAGS_LIMIT = 15

const responseBody = (
    data,
    endpoint,
    code,
    error = null,
    limit = TAGS_LIMIT,
    offset = 0,
    total = 0
) => ({
    data,
    context: {
        endpoint: `/tags/${endpoint}`,
        limit,
        offset,
        total,
        success: !error,
        code,
        error
    }
})

export const all = async (req, res) => {
    const data = {
        limit: parseInt(req.query.limit) || TAGS_LIMIT,
        offset: parseInt(req.query.offset) || 0
    }

    const tags = new Tags(data)

    try {
        await tags.setAll()

        const tagsData = []

        for (let tag of tags.data) {
            tagsData.push({
                id: tag.id,
                name: tag.name,
                hub: tag.hub,
                createdAt: tag.createdAt,
                articles: parseInt(tag.dataValues.articles)
            })
        }

        res.json(responseBody(
            tagsData,
            'all',
            200,
            null,
            data.limit,
            data.offset,
            tags.total
        ))
    } catch (error) {
        res.json(responseBody(
            null,
            'all',
            500,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
