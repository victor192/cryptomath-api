import {Articles} from "../models/article"

//  Restrictions for queries
const ARTICLES_LIMIT = 10

const responseBody = (
    data,
    endpoint,
    code = 200,
    time = 0,
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
        error,
        time
    }
})

export const all = async (req, res) => {
    //  Parse data from request body
    const data = {
        limit: parseInt(req.body.limit) || ARTICLES_LIMIT,
        offset: parseInt(req.body.offset) || 0,
        filters: req.body.filters || false,
        sorts: req.body.sorts || false,
        search: req.body.search || false
    }
    const extended = req.body.extended ? !!req.body.extended : false

    //  Initializing Articles class
    const articles = new Articles(data, extended)

    try {
        //  Loading articles data from a database
        await articles.setData()

        //  Data output
        res.json(responseBody(
            articles.data,
            'all',
            200,
            articles.timing,
            null,
            data.limit,
            data.offset,
            articles.total
        ))
    } catch(error) {
        //  Error output
        res.json(responseBody(
            null,
            'all',
            500,
            articles.timing,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
