import {Stats} from "../models/stats";

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
        error
    }
})

export const general = async (req, res) => {
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
            'general'
        ))
    } catch(error) {
        res.json(responseBody(
            null,
            'general',
            500,
            0,
            {
                source: 'internal',
                type: 'exception',
                message: error.message
            }
        ))
    }
}
