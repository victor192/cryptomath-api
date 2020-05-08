import {getInstance} from "../models"
import {Articles} from "../models/article"
import {User} from "../models/user"
import {Hubs} from "../models/hub"
import {Tags} from "../models/tag"
import {randomInt} from "../utils/math"

const ARTICLES_LIMIT = 10
const HUBS_LIMIT = 10
const TAGS_LIMIT = 10

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

    const articleModel = getInstance('Article')
    const articles = new Articles(articleModel, data)
    const userModel = getInstance('User')
    const user = new User(userModel)
    const hubsModel = getInstance('Hub')
    const hubs = new Hubs(hubsModel, {
        limit: HUBS_LIMIT,
        offset: 0
    })
    const tagsModel = getInstance('Tag')
    const tags = new Tags(tagsModel, {
        limit: TAGS_LIMIT,
        offset: 0
    })

    try {
        await articles.setData()

        const articlesData = []

        for (let article of articles.data) {
            const userLoaded = await user.get(article.author)

            await hubs.allIn(article.hubs)
            await tags.allIn(article.tags)

            if (userLoaded) {
                const userData = user.data
                const articleObject = {
                    id: article.id,
                    title: article.title,
                    createdAt: article.createdAt,
                    stats: {
                        answers: randomInt(0, 5),
                        votes: randomInt(-5, 5)
                    },
                    author: {
                        id: userData.id,
                        displayName: userData.displayName,
                        hash: userData.hash,
                    },
                    hubs: hubs.data,
                    tags: tags.data
                }

                articlesData.push(articleObject)
            }
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
