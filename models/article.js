const { DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
import {articles} from "../tests/articles"

export const ArticleModel = () => {
    const db = getConnection()

    return db.define('Article', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        raw: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        author: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hubs: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false
        }
    }, {
        tableName: 'articles',
    })
}

export const ArticleDefaults = (model) => {
    try {
        articles.forEach(async (article) => {
            await model.findOrCreate({
                where: {id: article.id},
                defaults: article
            })
        })
    } catch (error) {
        throw new Error(error)
    }
}

export class Articles {
    constructor(model, data) {
        this.model = model
        this.limit = data.limit
        this.offset = data.offset
        this.data = []
        this.total = 0
    }

    async setData() {
        try {
            this.data = await this.model.findAll({
                attributes: ['id', 'title', 'author', 'createdAt', 'hubs', 'tags'],
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.total = await this.model.count()

            return true
        } catch (error) {
            throw error
        }
    }
}
