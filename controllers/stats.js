import {Stats} from "../models/stats"

const responseBody = (
    body,
    endpoint,
    code = 200,
    time = 0,
    error = null
) => ({
    data: body,
    context: {
        endpoint: `/stats/${endpoint}`,
        success: !error,
        code,
        error,
        time
    }
})

export const all = async (req, res) => {
    const stats = new Stats()

    try {
        await stats.setData()

        res.json(responseBody({
                articles: stats.articles,
                users: stats.users,
                organizations: stats.organizations,
                hubs: stats.hubs,
                tags: stats.tags
            },
            'all',
            200,
            stats.timing
        ))
    } catch(error) {
        res.json(responseBody(
            null,
            'all',
            500,
            stats.timing,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
