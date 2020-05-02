const { DataTypes } = require('sequelize')

import {getConnection} from '../core/database'

export const CaptchaModel = async () => {
    const db = getConnection()

    return db.define('captcha', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT
        },
        task_id: {
            type: DataTypes.INTEGER
        },
        difficulty: {
            type: DataTypes.INTEGER
        }
    })
}

export class Captcha {
    constructor(model) {
        this.model = model
    }
}
