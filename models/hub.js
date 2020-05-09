const { Op, DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
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
            primaryKey: true,
            allowNull: false
        },
    }, {
        tableName: 'hubs',
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
    constructor({hubModel, articleModel, limit, offset}) {
        this.hubModel = hubModel
        this.articleModel = articleModel
        this.limit = limit
        this.offset = offset
        this.data = []
        this.total = 0
    }

    async setAll() {
        try {
            const hubs = await this.hubModel.findAll({
                attributes: ['id', 'name'],
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            for (let hub of hubs) {
                const articles = await this.articleModel.count({
                    where: {
                        hubs: {
                            [Op.contains]: [hub.id]
                        }
                    }
                })

                this.data.push({
                    id: hub.id,
                    name: hub.name,
                    createdAt: hub.createdAt,
                    articles
                })
            }

            this.total = await this.hubModel.count()

            return true
        } catch (error) {
            throw error
        }
    }

    async setAllIn(ids) {
        try {
            const hubs = await this.hubModel.findAndCountAll({
                attributes: ['id', 'name', 'createdAt'],
                where: {
                    id: ids
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.data = hubs.rows
            this.total = hubs.count

            return true
        } catch (error) {
            throw error
        }
    }
}
