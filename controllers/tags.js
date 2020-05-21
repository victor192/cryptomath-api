import {Tags} from "../models/tag"

const TAGS_LIMIT = 20

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
        limit: parseInt(req.body.limit) || TAGS_LIMIT,
        offset: parseInt(req.body.offset) || 0,
        filters: req.body.filters || false,
        sorts: req.body.sorts || false
    }

    const tags = new Tags(data)

    try {
        await tags.setData()

        res.json(responseBody(
            tags.data,
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
