import {Tags} from "../models/tag"

const TAGS_LIMIT = 20

const responseBody = (
    data,
    endpoint,
    code = 200,
    time = 0,
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
        error,
        time
    }
})

export const all = async (req, res) => {
    const data = {
        limit: parseInt(req.body.limit) || TAGS_LIMIT,
        offset: parseInt(req.body.offset) || 0,
        filters: req.body.filters || false,
        sorts: req.body.sorts || false,
        search: req.body.search || false
    }

    const tags = new Tags(data)

    try {
        await tags.setData()

        res.json(responseBody(
            tags.data,
            'all',
            200,
            tags.timing,
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
            tags.timing,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
