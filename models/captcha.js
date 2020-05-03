const { Op, DataTypes } = require('sequelize')

import {getConnection} from '../core/database'
import {getTasks, getTask} from '../captcha'

export const CaptchaModel = () => {
    const db = getConnection()

    return db.define('Captcha', {
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
    },
    {
        tableName: 'captcha'
    })
}

export const CaptchaDefaults = (model) => {
    const tasks = getTasks()

    try {
        tasks.forEach(async (t) => {
            await model.findOrCreate({
                where: {name: t.name, task_id: t.id},
                defaults: {
                    name: t.name,
                    task_id: t.id,
                    difficulty: t.difficulty
                }
            })
        })
    } catch (error) {
        throw new Error(error)
    }
}

export class Captcha {
    constructor(model, difficulty) {
        this.db = getConnection()
        this.model = model
        this.difficulty = difficulty || 5
        this.data = false
        this.math = ''
        this.loaded = false
    }

    async setData() {
        try {
            const data = await this.model.findOne({
                where: {
                    difficulty: {
                        [Op.lte]: this.difficulty
                    }
                },
                order: this.db.random()
            })

            const task = getTask(data.name, data.task_id)

            if (task) {
                const params = task.generate()

                this.math = task.math(...params)
                this.data = {
                    id: data.id,
                    ...{params}
                }
                this.loaded = true
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}
