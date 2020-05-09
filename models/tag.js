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
    constructor({tagModel, limit, offset}) {
        this.tagModel = tagModel
        this.limit = limit
        this.offset = offset
        this.data = []
        this.total = 0
    }

    async setAllInHub(hubId) {
        try {
            const tags = await this.tagModel.findAndCountAll({
                attributes: ['id', 'name', 'createdAt'],
                where: {
                    hub: hubId
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

    async setAllIn(ids) {
        try {
            const tags = await this.tagModel.findAndCountAll({
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

