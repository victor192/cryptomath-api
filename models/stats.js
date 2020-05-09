const { Op } = require('sequelize')

export class Stats {
    constructor({articleModel, userModel, hubModel, tagModel}) {
        this.articleModel = articleModel || null
        this.userModel = userModel || null
        this.hubModel = hubModel || null
        this.tagModel = tagModel || null

        this.articles = 0
        this.users = 0
        this.hubs = 0
        this.tags = 0
        this.relatedTags = []
    }

    async setData() {
        try {
            this.articles = await this.articleModel.count()
            this.users = await this.userModel.count()
            this.hubs = await this.hubModel.count()
            this.tags = await this.tagModel.count()

            return true
        } catch (error) {
            throw error
        }
    }

    async setRelatedTags() {
        try {
            const tags = await this.tagModel.findAll({
                limit: 10,
                order: [
                    ['createdAt', 'DESC']
                ],
            })

            for (let tag of tags) {
                const articles = await this.articleModel.count({
                    where: {
                        tags: {
                            [Op.contains]: [tag.id]
                        }
                    }
                })

                this.relatedTags.push({
                    id: tag.id,
                    name: tag.name,
                    articles
                })
            }

            return true
        } catch (error) {
            throw error
        }
    }
}
