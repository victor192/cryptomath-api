const { DataTypes } = require('sequelize')

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

    async get(id) {
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
    constructor(model, data) {
        this.model = model
        this.limit = data.limit
        this.offset = data.offset
        this.data = []
        this.total = 0
    }

    async allIn(ids) {
        try {
            const hubs = await this.model.findAndCountAll({
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
