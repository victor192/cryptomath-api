import {Hubs} from "../models/hub";
import {TagsInHub} from "../models/tag"

const HUBS_LIMIT = 10
const TAGS_LIMIT = 10

const responseBody = (
    data,
    endpoint,
    code = 200,
    time = 0,
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
        error,
        time
    }
})

export const all = async (req, res) => {
    const data = {
        limit: parseInt(req.body.limit) || HUBS_LIMIT,
        offset: parseInt(req.body.offset) || 0,
        filters: req.body.filters || false,
        sorts: req.body.sorts || false,
        search: req.body.search || false
    }

    const hubs = new Hubs(data)

    try {
        await hubs.setData()

        for (let hub of hubs.data) {
            const tags = new TagsInHub({
                id: hub.id,
                limit: TAGS_LIMIT
            })

            await tags.setData()

            hubs.addTiming(tags.timing)
            hub.tags.data = tags.data
        }

        res.json(responseBody(
            hubs.data,
            'all',
            200,
            hubs.timing,
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
            hubs.timing,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
