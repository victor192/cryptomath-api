const { Sequelize, DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {hubs} from "../tests/hubs"

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

export class Hubs {
    constructor({limit, offset}) {
        this.db = getConnection()
        this.hubModel = getInstance('Hub')
        this.articleModel = getInstance('Article')
        this.limit = limit
        this.offset = offset
        this.data = []
        this.total = 0
    }

    async setAll() {
        try {
            this.data = await this.hubModel.findAll({
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
                    'Hub.id',
                    'Articles.id',
                    'Articles.ArticleHub.id'
                ],
                order: [
                    [this.db.fn("COUNT", this.db.col("Articles.id")), 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.total = await this.hubModel.count()

            return true
        } catch (error) {
            throw error
        }
    }
}
