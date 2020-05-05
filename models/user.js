const bcrypt = require('bcrypt')
const md5 = require('md5')
const { Op, DataTypes } = require('sequelize')

import {getConnection} from "../core/database";

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
            confirmCode: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            confirmedAt: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'user',
            hooks: {
                beforeCreate: async function(user) {
                    const salt = await bcrypt.genSalt(10)
                    const confirmPlain = user.confirmCode + Date.now().toString()

                    user.password = await bcrypt.hash(user.password, salt)
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

export class User {
    constructor(model) {
        this.model = model
        this.dataProxy = false
    }

    set data(user) {
        this.dataProxy = {
            id: user.id,
            displayName: user.displayName,
            email: user.email
        }
    }

    get data() {
        return this.dataProxy
    }

    async create(data) {
        try {
            const count = await this.model.count({
                where: {
                    email: data.email
                }
            })

            if (count > 0) {
                return false
            }

            const userData = Object.assign(data, {
                confirmCode: '' + data.email + data.displayName
            })
            const user = this.model.build(userData)
            await user.validate()
            await user.save()

            this.data = user

            return true
        } catch (error) {
            throw error
        }
    }

    async login(data) {
        try {
            const user = await this.model.findOne({
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
            throw error
        }
    }

    async get(id) {
        try {
            const user = await this.model.findOne({
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
            throw error
        }
    }
}
