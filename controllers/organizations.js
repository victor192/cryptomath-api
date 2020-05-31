import {Organizations} from "../models/organization"

const ORGANIZATIONS_LIMIT = 10

const responseBody = (
    data,
    endpoint,
    code,
    time = 0,
    error = null,
    limit = ORGANIZATIONS_LIMIT,
    offset = 0,
    total = 0
) => ({
    data,
    context: {
        endpoint: `/organizations/${endpoint}`,
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
        limit: parseInt(req.body.limit) || ORGANIZATIONS_LIMIT,
        offset: parseInt(req.body.offset) || 0,
        filters: req.body.filters || false,
        sorts: req.body.sorts || false,
        search: req.body.search || false
    }

    const organizations = new Organizations(data)

    try {
        await organizations.setData()

        res.json(responseBody(
            organizations.data,
            'all',
            200,
            organizations.timing,
            null,
            data.limit,
            data.offset,
            organizations.total
        ))
    } catch (error) {
        res.json(responseBody(
            null,
            'all',
            500,
            organizations.timing,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
