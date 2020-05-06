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
            type: DataTypes.TEXT,
            allowNull: false
        },
        taskId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true
            }
        },
        difficulty: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true
            }
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
                where: {name: t.name, taskId: t.id},
                defaults: {
                    name: t.name,
                    taskId: t.id,
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
        this.data = null
        this.math = ''
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

            const task = getTask(data.name, data.taskId)

            if (task) {
                const params = task.generate()

                this.math = task.math(...params)
                this.data = {
                    id: data.id,
                    ...{params}
                }

                return true
            }

            return false
        } catch (error) {
            throw error
        }
    }
}

export class ValidateCaptcha {
    constructor(model, id) {
        this.model = model
        this.id = id
        this.answer = null
    }

    async setData() {
        try {
            const data = await this.model.findOne({
                where: {
                    id: this.id
                }
            })

            const task = getTask(data.name, data.taskId)

            if (task) {
                this.answer = task.answer

                return true
            }

            return false
        } catch (error) {
            throw error
        }
    }

    validate(params, answer) {
        if (this.answer) {
            const realAnswer = this.answer(...params)
            const checkAnswer = parseInt(answer)

            return realAnswer === checkAnswer
        }

        return false
    }
}
