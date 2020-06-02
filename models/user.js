const bcrypt = require('bcrypt')
const md5 = require('md5')
const { Op, DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
import {getInstance} from "./index"
import {users} from "../tests/users"

export const UserModel = () => {
    const db = getConnection()
    const model = db.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            displayName: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            email: {
                type: DataTypes.TEXT,
                primaryKey: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    min: 8,
                    is: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i
                }
            },
            hash: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            confirmCode: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            confirmedAt: {
                type: DataTypes.DATE
            }
        },
        {
            freezeTableName: true,
            tableName: 'Users',
            hooks: {
                beforeCreate: async function(user) {
                    const salt = await bcrypt.genSalt(10)
                    const confirmPlain = user.confirmCode + Date.now().toString()

                    user.password = await bcrypt.hash(user.password, salt)
                    user.hash = md5(Date.now().toString() + user.hash)
                    user.confirmCode = md5(confirmPlain)
                }
            }
        }
    )

    model.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password)
    }

    return model
}

export const UserDefaults = async (model) => {
    try {
        for (let user of users) {
            await model.findOrCreate({
                where: {
                    id: user.id,
                    email: user.email
                },
                defaults: user
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export class User {
    constructor() {
        this.userModel = getInstance('User')

        this.dataProxy = null
    }

    set data(user) {
        this.dataProxy = {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            hash: user.hash
        }
    }

    get data() {
        return this.dataProxy
    }

    async create(data) {
        try {
            const count = await this.userModel.count({
                where: {
                    email: data.email
                }
            })

            if (count > 0) {
                return false
            }

            const confirmCode = String(data.email + data.displayName)
            const userData = Object.assign(data, {
                confirmCode,
                hash: md5(confirmCode)
            })
            const user = this.userModel.build(userData)
            await user.validate()
            await user.save()

            this.data = user

            return true
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const item = error.errors[0]

                throw {
                    name: 'validation',
                    data: {
                        source: item.path,
                        type: 'invalid'
                    }
                }
            }
            else {
                throw new Error(error)
            }
        }
    }

    async login(data) {
        try {
            const user = await this.userModel.findOne({
                where: {
                    email: data.email,
                    confirmedAt: {
                        [Op.not]: null
                    }
                }
            })

            if (!user) {
                return [false, 'not_found']
            }

            const isValidPassword = await user.validPassword(data.password)

            if (!isValidPassword) {
                return [false, 'wrong_password']
            }

            this.data = user

            return [true, null]
        } catch (error) {
            throw new Error(error)
        }
    }

    async get(id) {
        try {
            const user = await this.userModel.findOne({
                where: {
                    id: id
                }
            })

            if (!user) {
                return false
            }

            this.data = user

            return true
        } catch (error) {
            throw new Error(error)
        }
    }
}
