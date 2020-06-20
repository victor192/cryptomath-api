const { Op, DataTypes } = require('sequelize')

import {getConnection} from '../core/database'
import {getInstance} from "./index";
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
        freezeTableName: true,
        tableName: 'Captchas'
    })
}

export const CaptchaDefaults = async (model) => {
    const tasks = getTasks()

    try {
        for (let task of tasks) {
            await model.findOrCreate({
                where: {
                    name: task.name,
                    taskId: task.id
                },
                defaults: {
                    name: task.name,
                    taskId: task.id,
                    difficulty: task.difficulty
                }
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export class Captcha {
    constructor(difficulty) {
        this.db = getConnection()
        this.captchaModel = getInstance('Captcha')
        this.difficulty = difficulty || 5
        this.data = null
        this.math = ''
    }

    async setData() {
        try {
            const data = await this.captchaModel.findOne({
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
    constructor(id) {
        this.captchaModel = getInstance('Captcha')
        this.id = id
        this.answer = null
    }

    async setData() {
        try {
            const data = await this.captchaModel.findOne({
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
