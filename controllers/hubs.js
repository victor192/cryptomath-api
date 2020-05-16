import {Hubs} from "../models/hub";
import {Tags} from "../models/tag"

const HUBS_LIMIT = 10
const TAGS_LIMIT = 10

const responseBody = (
    data,
    endpoint,
    code,
    error = null,
    limit = HUBS_LIMIT,
    offset = 0,
    total = 0
) => ({
    data,
    context: {
        endpoint: `/hubs/${endpoint}`,
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
        limit: parseInt(req.query.limit) || HUBS_LIMIT,
        offset: parseInt(req.query.offset) || 0
    }

    const hubs = new Hubs(data)
    const tags = new Tags({
        limit: TAGS_LIMIT,
        offset: 0
    })

    try {
        await hubs.setAll()

        const hubsData = []

        for (let hub of hubs.data) {
            await tags.setAllInHub(hub.id)

            hubsData.push({
                id: hub.id,
                name: hub.name,
                createdAt: hub.createdAt,
                articles: parseInt(hub.dataValues.articles),
                tags: {
                    total: tags.total,
                    data: tags.data.map(tag => ({
                        id: tag.id,
                        name: tag.name,
                        createdAt: tag.createdAt,
                        articles: parseInt(tag.dataValues.articles)
                    }))
                }
            })
        }

        res.json(responseBody(
            hubsData,
            'all',
            200,
            null,
            data.limit,
            data.offset,
            hubs.total
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
