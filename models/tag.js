const { DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
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
            primaryKey: true,
            allowNull: false
        },
        hub: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'tags',
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

    async get(id) {
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
    constructor(model, data) {
        this.model = model
        this.limit = data.limit
        this.offset = data.offset
        this.data = []
        this.total = 0
    }

    async allIn(ids) {
        try {
            const tags = await this.model.findAndCountAll({
                attributes: ['id', 'name', 'hub', 'createdAt'],
                where: {
                    id: ids
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.data = tags.rows
            this.total = tags.count

            return true
        } catch (error) {
            throw error
        }
    }
}

