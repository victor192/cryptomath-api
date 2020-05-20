import {QueryTypes, DataTypes} from "sequelize";

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {tags} from "../tests/tags"
import {prepareQuery} from "../utils/queries";

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
        timestamps: false
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
}

export class TagsInHub {
    constructor({id, limit}) {
        this.db = getConnection()
        this.tagModel = getInstance('Tag')
        this.articleTagModel = getInstance('ArticleTag')
        this.articleModel = getInstance('Article')

        this.hubId = id
        this.limit = limit

        this.dataProxy = []
    }

    get cols() {
        return {
            id: '"Tag"."id"',
            name: '"Tag"."name"'
        }
    }

    get data() {
        return this.dataProxy
    }

    set data(tagsRaw) {
        const tags = []

        for (let tag of tagsRaw) {
            const tagObject = {
                id: tag.id,
                name: tag.name
            }

            tags.push(tagObject)
        }

        this.dataProxy = tags
    }

    async setData() {
        try {
            this.data = await this.db.query(prepareQuery(`
                SELECT
                    ${this.cols.id},
                    ${this.cols.name}
                FROM "${this.tagModel.tableName}" AS "Tag"
                LEFT OUTER JOIN ("${this.articleTagModel.tableName}" AS "ArticleTag"
                        INNER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."id" = "ArticleTag"."article") ON ${this.cols.id} = "ArticleTag"."tag"
                WHERE "Tag"."hub" = ${this.hubId}
                GROUP BY ${this.cols.id}
                ORDER BY COUNT(DISTINCT(${this.cols.id})) DESC
            `), {
                model: this.tagModel,
                type: QueryTypes.SELECT
            })
        } catch (error) {
            throw error
        }
    }
}

