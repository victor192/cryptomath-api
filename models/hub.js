import {DataTypes, QueryTypes} from "sequelize";

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {hubs} from "../tests/hubs"
import {
    prepareWhere,
    prepareOrder,
    prepareQuery
} from "../utils/queries";
import {FilteredList} from "./mixins";

export const HubModel = () => {
    const db = getConnection()

    return db.define('Hub', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        tableName: 'Hubs',
        timestamps: false
    })
}

export const HubDefaults = (model) => {
    try {
        hubs.forEach(async (hub) => {
            await model.findOrCreate({
                where: {id: hub.id, name: hub.name},
                defaults: hub
            })
        })
    } catch (error) {
        throw new Error(error)
    }
}

export class Hub {
    constructor(model) {
        this.model = model
        this.data = null
    }

    async setData(id) {
        try {
            const hub = await this.model.findOne({
                where: {
                    id: id
                }
            })

            if (!hub) {
                return false
            }

            this.data = hub

            return true
        } catch (error) {
            throw error
        }
    }
}

const hubsFields = [
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
        field: 'tags',
        filter: 'numeric',
        sortable: true
    },
    {
        field: 'articles',
        filter: 'numeric',
        sortable: true
    }
]

export class Hubs extends FilteredList {
    constructor({filters, sorts, limit, offset}) {
        super({
            fields: hubsFields,
            filters,
            sorts,
            limit,
            offset
        })

        this.hubModel = getInstance('Hub')
        this.articleHubModel = getInstance('ArticleHub')
        this.articleModel = getInstance('Article')
        this.tagModel = getInstance('Tag')
    }

    get cols() {
        return {
            id: '"Hub"."id"',
            name: '"Hub"."name"',
            tags: 'COUNT(DISTINCT("Tag"."id"))',
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

        return prepareWhere(wheres)
    }

    get having() {
        const havings = []

        if (this.filters.tags) {
            havings.push({
                column: this.cols.tags,
                filter: this.filters.tags
            })
        }

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

        if (this.sorts.tags) {
            orders.push({
                column: this.cols.tags,
                direction: this.sorts.tags
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

    set data(hubsRaw) {
        const hubs = []

        for (let hub of hubsRaw) {
            const dataValues = hub['dataValues']
            const hubObject = {
                id: hub.id,
                name: hub.name,
                tags: {
                    total: parseInt(dataValues.tags)
                },
                articles: parseInt(dataValues.articles)
            }

            hubs.push(hubObject)
        }

        this.dataProxy = hubs
    }

    async setData() {
        try {
            this.data = await this.db.query(prepareQuery(`
                SELECT DISTINCT
                    ${this.cols.id},
                    ${this.cols.name},
                    ${this.cols.tags} AS "tags",
                    ${this.cols.articles} AS "articles"
                FROM "${this.hubModel.tableName}" AS "Hub"
                    LEFT OUTER JOIN ("${this.articleHubModel.tableName}" AS "ArticleHub"
                        INNER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."id" = "ArticleHub"."article") ON ${this.cols.id} = "ArticleHub"."hub"
                    LEFT OUTER JOIN "${this.tagModel.tableName}" AS "Tag" ON ${this.cols.id} = "Tag"."hub"  
                WHERE ${this.where}
                GROUP BY
                    ${this.cols.id}
                HAVING ${this.having}    
                ORDER BY ${this.order}
                OFFSET ${this.offset}
                LIMIT ${this.limit}    
            `), {
                model: this.hubModel,
                type: QueryTypes.SELECT
            })

            this.total = await this.db.query(prepareQuery(`
                SELECT COUNT("id") AS "total"
                    FROM (
                        SELECT DISTINCT
                            ${this.cols.id} AS "id"
                        FROM "${this.hubModel.tableName}" AS "Hub"
                            LEFT OUTER JOIN ("${this.articleHubModel.tableName}" AS "ArticleHub"
                                INNER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."id" = "ArticleHub"."article") ON ${this.cols.id} = "ArticleHub"."hub"
                            LEFT OUTER JOIN "${this.tagModel.tableName}" AS "Tag" ON ${this.cols.id} = "Tag"."hub"
                        WHERE ${this.where}
                        GROUP BY
                            ${this.cols.id}
                        HAVING ${this.having}
                    ) AS "result"
            `), {
                model: this.hubModel,
                type: QueryTypes.SELECT
            })
        } catch (error) {
            throw error
        }
    }
}
