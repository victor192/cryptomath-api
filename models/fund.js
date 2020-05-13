const { DataTypes } = require('sequelize')

import {getConnection} from "../core/database";
import {funds} from "../tests/funds";

export const FundModel = () => {
    const db = getConnection()

    return db.define('Fund', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isUrl: true
            }
        }
    }, {
        freezeTableName: true,
        tableName: 'Funds',
    })
}

export const FundDefaults = (model) => {
    try {
        funds.forEach(async (fund) => {
            await model.findOrCreate({
                where: {id: fund.id},
                defaults: fund
            })
        })
    } catch (error) {
        throw new Error(error)
    }
}

export class Funds {
    constructor({fundModel, limit, offset}) {
        this.fundModel = fundModel
        this.limit = limit
        this.offset = offset
        this.data = []
        this.total = 0
    }

    async setData() {
        try {
            this.data = await this.fundModel.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: this.offset,
                limit: this.limit
            })

            this.total = await this.fundModel.count()

            return true
        } catch (error) {
            throw error
        }
    }
}
