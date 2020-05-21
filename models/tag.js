import {QueryTypes, DataTypes} from "sequelize";

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {tags} from "../tests/tags"
import {
    prepareOrder,
    prepareQuery,
    prepareWhere
} from "../utils/queries";
import {FilteredList} from "./mixins";

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

const tagsFields = [
    {
        field: 'id',
        filter: 'id',
        sortable: false
    },
    {
        field: 'name',
        filter: 'text',
        sortable: true
    },
    {
        field: 'hub',
        filter: 'id',
        sortable: false
    },
    {
        field: 'articles',
        filter: 'numeric',
        sortable: true
    }
]

export class Tags extends FilteredList {
    constructor({filters, sorts, limit, offset}) {
        super({
            fields: tagsFields,
            filters,
            sorts,
            limit,
            offset
        })

        this.tagModel = getInstance('Tag')
        this.articleTagModel = getInstance('ArticleTag')
        this.articleModel = getInstance('Article')
    }

    get cols() {
        return {
            id: '"Tag"."id"',
            name: '"Tag"."name"',
            hub: '"Tag"."hub"',
            articles: 'COUNT(DISTINCT("Article"."id"))'
        }
    }

    get where() {
        const wheres = []

        if (this.filters.id) {
            wheres.push({
                column: this.cols.id,
                filter: this.filters.id
            })
        }

        if (this.filters.name) {
            wheres.push({
                column: this.cols.name,
                filter: this.filters.name
            })
        }

        if (this.filters.hub) {
            wheres.push({
                column: this.cols.hub,
                filter: this.filters.hub
            })
        }

        return prepareWhere(wheres)
    }

    get having() {
        const havings = []

        if (this.filters.articles) {
            havings.push({
                column: this.cols.articles,
                filter: this.filters.articles
            })
        }

        return prepareWhere(havings)
    }

    get order() {
        const orders = []

        if (this.sorts.name) {
            orders.push({
                column: this.cols.name,
                direction: this.sorts.name
            })
        }

        if (this.sorts.articles) {
            orders.push({
                column: this.cols.articles,
                direction: this.sorts.articles
            })
        }
        else {
            orders.push({
                column: this.cols.articles,
                direction: 'DESC'
            })
        }

        return prepareOrder(orders)
    }

    get data() {
        return super.data
    }

    set data(tagsRaw) {
        const tags = []

        for (let tag of tagsRaw) {
            const dataValues = tag['dataValues']
            const tagObject = {
                id: tag.id,
                name: tag.name,
                hub: tag.hub,
                articles: parseInt(dataValues.articles)
            }

            tags.push(tagObject)
        }

        this.dataProxy = tags
    }

    async setData() {
        try {
            this.data = await this.db.query(prepareQuery(`
                SELECT DISTINCT
                    ${this.cols.id},
                    ${this.cols.name},
                    ${this.cols.hub},
                    ${this.cols.articles} AS "articles"
                FROM "${this.tagModel.tableName}" AS "Tag"
                LEFT OUTER JOIN ("${this.articleTagModel.tableName}" AS "ArticleTag"
                        INNER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."id" = "ArticleTag"."article") ON ${this.cols.id} = "ArticleTag"."tag"
                WHERE ${this.where}
                GROUP BY
                    ${this.cols.id}
                HAVING ${this.having}    
                ORDER BY ${this.order}
                OFFSET ${this.offset}
                LIMIT ${this.limit}    
            `), {
                model: this.tagModel,
                type: QueryTypes.SELECT
            })

            this.total = await this.db.query(prepareQuery(`
                SELECT COUNT("id") AS "total"
                    FROM (
                        SELECT DISTINCT
                            ${this.cols.id} AS "id"
                        FROM "${this.tagModel.tableName}" AS "Tag"
                            LEFT OUTER JOIN ("${this.articleTagModel.tableName}" AS "ArticleTag"
                            INNER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."id" = "ArticleTag"."article") ON ${this.cols.id} = "ArticleTag"."tag"
                        WHERE ${this.where}
                        GROUP BY
                            ${this.cols.id}
                        HAVING ${this.having}
                    ) AS "result"
            `), {
                model: this.tagModel,
                type: QueryTypes.SELECT
            })
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

