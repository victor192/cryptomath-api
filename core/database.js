const { Sequelize } = require('sequelize')

let connected = false
let connection = null

export const connect = async () => {
    try {
        connection = new Sequelize({
            database: process.env.DB_NAME,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            dialect: process.env.DB_CONNECTION,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        })

        await connection.authenticate()

        connected = true

        console.log('Connection to database has been established successfully.')
    } catch (error) {
        throw new Error('Unable to connect to the database:', error)
    }
}

export const close = async() => {
    if (connected) {
        try {
            await connection.close()

            connected = false

            console.log('Connection to database has been closed.')
        } catch(error) {
            throw new Error('Unable to close database connection:', error)
        }
    }
}

export const getConnection = () => connection
