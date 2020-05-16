import {Articles} from "../models/article"

const ARTICLES_LIMIT = 10

const responseBody = (
    data,
    endpoint,
    code,
    error = null,
    limit = ARTICLES_LIMIT,
    offset = 0,
    total = 0
) => ({
    data,
    context: {
        endpoint: `/articles/${endpoint}`,
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
        limit: parseInt(req.query.limit) || ARTICLES_LIMIT,
        offset: parseInt(req.query.offset) || 0
    }

    const articles = new Articles(data)

    try {
        await articles.setData()

        const articlesData = []

        for (let article of articles.data) {
            articlesData.push({
                id: article.id,
                title: article.title,
                createdAt: article.createdAt,
                author: {
                    id: article.User.id,
                    displayName: article.User.displayName,
                    hash: article.User.hash
                },
                hubs: article.Hubs.map(hub => ({
                    id: hub.id,
                    name: hub.name
                })),
                tags: article.Tags.map(tag => ({
                    id: tag.id,
                    name: tag.name,
                    hub: tag.hub
                })),
                answers: parseInt(article.dataValues.answers),
                votes: parseInt(article.dataValues.votes)
            })
        }

        res.json(responseBody(
            articlesData,
            'all',
            200,
            null,
            data.limit,
            data.offset,
            articles.total
        ))
    } catch(error) {
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
