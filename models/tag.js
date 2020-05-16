const { Sequelize, DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {tags} from "../tests/tags"

export const TagModel = () => {
    const db = getConnection()

    return db.define('Tag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        hub: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'Tags',
    })
}

export const TagAssociations = (model) => {
    const hubModel = getInstance('Hub')

    hubModel.Tag = hubModel.hasMany(model, {
        foreignKey: 'id',
        constraints: false
    })

    model.Hub = model.belongsTo(hubModel, {
        foreignKey: 'hub',
        constraints: false
    })
}

export const TagDefaults = (model) => {
    try {
        tags.forEach(async (tag) => {
            await model.findOrCreate({
                where: {id: tag.id, name: tag.name},
                defaults: tag
            })
        })
    } catch (error) {
        throw new Error(error)
    }
}

export class Tag {
    constructor(model) {
        this.model = model
        this.data = null
    }

    async setData(id) {
        try {
            const tag = await this.model.findOne({
                where: {
                    id: id
                }
            })

            if (!tag) {
                return false
            }

            this.data = tag

            return true
        } catch (error) {
            throw error
        }
    }
}

export class Tags {
    constructor({limit, offset}) {
        this.db = getConnection()
        this.articleModel = getInstance('Article')
        this.articleTagModel = getInstance('ArticleTag')
        this.tagModel = getInstance('Tag')
        this.limit = limit
        this.offset = offset
        this.data = []
        this.total = 0
    }

    async setAll() {
        try {
            this.data = await this.tagModel.findAll({
                attributes: [
                    'id',
                    'name',
                    'createdAt',
                    [this.db.fn("COUNT", this.db.col("Articles.id")), "articles"]
                ],
                include: [
                    {
                        model: this.articleModel,
                        duplicating: false,
                        attributes: [],
                    }
                ],
                group: [
                    'Tag.id',
                    'Articles.id',
                    'Articles.ArticleTag.id'
                ],
                order: [
                    [this.db.fn("COUNT", this.db.col("Articles.id")), 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.total = await this.tagModel.count()

            return true
        } catch (error) {
            throw error
        }
    }

    async setAllInHub(hubId) {
        try {
            this.data = await this.tagModel.findAll({
                attributes: [
                    'id',
                    'name',
                    'createdAt',
                    [this.db.fn("COUNT", this.db.col("Articles.id")), "articles"]
                ],
                include: [
                    {
                        model: this.articleModel,
                        duplicating: false,
                        attributes: [],
                    }
                ],
                where: {
                    hub: hubId
                },
                group: [
                    'Tag.id',
                    'Articles.id',
                    'Articles.ArticleTag.id'
                ],
                order: [
                    [this.db.fn("COUNT", this.db.col("Articles.id")), 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.total = await this.tagModel.count({
                where: {
                    hub: hubId
                }
            })

            return true
        } catch (error) {
            throw error
        }
    }
}

