const bcrypt = require('bcrypt')
const { DataTypes } = require('sequelize')

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
            }
        },
        {
            tableName: 'user',
            hooks: {
                beforeCreate: async function(user) {
                    const salt = await bcrypt.genSalt(10)

                    user.password = await bcrypt.hash(user.password, salt)
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
        this.data = false
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

            const user = this.model.build(data)
            await user.validate()
            await user.save()

            this.data = {
                id: user.id,
                displayName: user.displayName,
                email: user.email
            }

            return true
        } catch (error) {
            throw error
        }
    }
}
