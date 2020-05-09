import {getInstance} from "../models"
import {Funds} from "../models/fund"
import {randomInt} from "../utils/math";

const FUNDS_LIMIT = 10

const responseBody = (
    data,
    endpoint,
    code,
    error = null,
    limit = FUNDS_LIMIT,
    offset = 0,
    total = 0
) => ({
    data,
    context: {
        endpoint: `/funds/${endpoint}`,
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
        limit: parseInt(req.query.limit) || FUNDS_LIMIT,
        offset: parseInt(req.query.offset) || 0
    }

    const fundModel = getInstance('Fund')
    const funds = new Funds({
        fundModel,
        ...data
    })

    try {
        await funds.setData()

        const fundsData = []

        for (let fund of funds.data) {
            const fundObject = {
                id: fund.id,
                title: fund.title,
                description: fund.description,
                createdAt: fund.createdAt,
                url: fund.url,
                articles: randomInt(0, 10)
            }

            fundsData.push(fundObject)
        }

        res.json(responseBody(
            fundsData,
            'all',
            200,
            null,
            data.limit,
            data.offset,
            funds.total
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
