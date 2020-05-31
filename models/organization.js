import {DataTypes, QueryTypes} from "sequelize"

import {getConnection} from "../core/database"
import {organizations} from "../tests/organizations"
import {getInstance} from "./index"
import {FilteredList} from "./mixins"
import {
    prepareOrder,
    prepareQuery,
    prepareWhere
} from "../utils/queries"

const updateOrganizationTsv = (db, model) => async (organization, options) => {
    try {
        await model.update({
            tsv: db.literal("setweight(to_tsvector(title), 'A') || setweight(to_tsvector(description), 'B') || setweight(to_tsvector(url), 'C')")
        }, {
            where: {
                id: organization['id']
            },
            transaction: options.transaction
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const OrganizationModel = () => {
    const db = getConnection()
    const model = db.define('Organization', {
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
        },
        logo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        tsv: {
            type: 'TSVECTOR'
        }
    }, {
        freezeTableName: true,
        tableName: 'Organizations',
        timestamps: false,
        indexes: [
            {
                name: 'organization_search',
                fields: ['tsv'],
                using: 'gin'
            }
        ]
    })

    model.afterCreate(updateOrganizationTsv(db, model))
    model.afterUpdate(updateOrganizationTsv(db, model))

    return model
}

export const OrganizationUserModel = () => {
    const db = getConnection()

    return db.define('OrganizationUser', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        organization: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        user: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'OrganizationsUsers',
        timestamps: false
    })
}

export const OrganizationAssociations = (model) => {
    const organizationUserModel = getInstance('OrganizationUser')
    const userModel = getInstance('User')
    const articleModel = getInstance('Article')

    //  Organization user associations
    model.User = model.belongsToMany(userModel, {
        through: organizationUserModel,
        foreignKey: 'organization',
        constraints: false
    })

    //  User organization associations
    userModel.Organization = userModel.belongsToMany(model, {
        through: organizationUserModel,
        foreignKey: 'user',
        constraints: false
    })
}

export const OrganizationDefaults = async (model) => {
    try {
        for (let organization of organizations) {
            await model.findOrCreate({
                where: {id: organization.id},
                defaults: {
                    id: organization.id,
                    title: organization.title,
                    description: organization.description,
                    url: organization.url,
                    logo: organization.logo
                }
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const OrganizationUserDefaults = async (model) => {
    try {
        for (let organization of organizations) {
            for (let id of organization.users) {
                await model.findOrCreate({
                    where: {
                        organization: organization.id,
                        user: id
                    },
                    defaults: {
                        organization: organization.id,
                        user: id
                    }
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

const organizationFields = [
    {
        field: 'id',
        filter: 'id',
        sortable: false
    },
    {
        field: 'title',
        filter: 'text',
        sortable: true
    },
    {
        field: 'description',
        filter: false,
        sortable: false
    },
    {
        field: 'url',
        filter: 'text',
        sortable: false
    },
    {
        field: 'users',
        filter: 'numeric',
        sortable: true
    },
    {
        field: 'articles',
        filter: 'numeric',
        sortable: true
    }
]

export class Organizations extends FilteredList {
    constructor({filters, sorts, limit, offset, search}) {
        super({
            fields: organizationFields,
            filters,
            sorts,
            limit,
            offset,
            search
        })

        this.organizationModel = getInstance('Organization')
        this.organizationUserModel = getInstance('OrganizationUser')
        this.userModel = getInstance('User')
        this.articleModel = getInstance('Article')
    }

    get cols() {
        return {
            id: '"Organization"."id"',
            title: '"Organization"."title"',
            description: '"Organization"."description"',
            url: '"Organization"."url"',
            logo: '"Organization"."logo"',
            tsv: '"Organization"."tsv"',
            users: 'COUNT(DISTINCT("User"."id"))',
            articles: 'COUNT(DISTINCT("Article"."id"))'
        }
    }

    get tsQuery() {
        return this.search ? `plainto_tsquery('${this.search}')` : ''
    }

    get rankCol() {
        return this.search ? `TS_RANK(${this.cols.tsv}, ${this.tsQuery})` : ''
    }

    get where() {
        const wheres = []

        if (this.filters.id) {
            wheres.push({
                column: this.cols.id,
                filter: this.filters.id
            })
        }

        if (this.filters.title) {
            wheres.push({
                column: this.cols.title,
                filter: this.filters.title
            })
        }

        if (this.filters.url) {
            wheres.push({
                column: this.cols.url,
                filter: this.filters.url
            })
        }

        if (this.search) {
            wheres.push({
                column: this.cols.tsv,
                filter: {
                    tsMatch: true,
                    operation: this.tsQuery
                }
            })
        }

        return prepareWhere(wheres)
    }

    get having() {
        const havings = []

        if (this.filters.users) {
            havings.push({
                column: this.cols.users,
                filter: this.filters.users
            })
        }

        if (this.filters.articles) {
            havings.push({
                column: this.cols.articles,
                filter: this.filters.articles
            })
        }

        return prepareWhere(havings)
    }

    get order() {
        const orders = []

        if (this.sorts.title) {
            orders.push({
                column: this.cols.title,
                direction: this.sorts.title
            })
        }

        if (this.sorts.users) {
            orders.push({
                column: this.cols.users,
                direction: this.sorts.users
            })
        }
        else {
            orders.push({
                column: this.cols.users,
                direction: 'DESC'
            })
        }

        if (this.sorts.articles) {
            orders.push({
                column: this.cols.articles,
                direction: this.sorts.articles
            })
        }

        if (this.search) {
            orders.push({
                column: '"rank"',
                direction: 'DESC'
            })
        }

        return prepareOrder(orders)
    }

    get data() {
        return super.data
    }

    set data(organizationsRaw) {
        const organizations = []

        for (let organization of organizationsRaw) {
            const dataValues = organization['dataValues']
            const organizationObject = {
                id: organization.id,
                title: organization.title,
                description: organization.description,
                url: organization.url,
                logo: organization.logo,
                users: parseInt(dataValues.users),
                articles: parseInt(dataValues.articles)
            }

            organizations.push(organizationObject)
        }

        this.dataProxy = organizations
    }

    async setData() {
        try {
            this.data = await this.db.query(prepareQuery(`
                SELECT DISTINCT
                    ${this.cols.id},
                    ${this.cols.title},
                    ${this.cols.description},
                    ${this.cols.url},
                    ${this.cols.logo},
                    ${this.search ? `${this.rankCol} AS "rank",` : ''}
                    ${this.cols.users} AS "users",
                    ${this.cols.articles} AS "articles"
                FROM "${this.organizationModel.tableName}" AS "Organization"
                    LEFT OUTER JOIN ( "${this.organizationUserModel.tableName}" AS "OrganizationUser" 
                        INNER JOIN "${this.userModel.tableName}" AS "User" ON "User"."id" = "OrganizationUser"."user") ON ${this.cols.id} = "OrganizationUser"."organization"
                    LEFT OUTER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."author" = "OrganizationUser"."user"
                WHERE ${this.where}
                GROUP BY
                    ${this.cols.id}
                HAVING ${this.having}    
                ORDER BY ${this.order}
                OFFSET ${this.offset}
                LIMIT ${this.limit}     
            `), {
                model: this.organizationModel,
                type: QueryTypes.SELECT,
                benchmark: true,
                logging: (sql, timing) => this.addTiming(timing)
            })

            this.total = await this.db.query(prepareQuery(`
                SELECT COUNT("id") AS "total"
                    FROM (
                        SELECT DISTINCT
                            ${this.cols.id} AS "id"
                        FROM "${this.organizationModel.tableName}" AS "Organization"
                            LEFT OUTER JOIN ( "${this.organizationUserModel.tableName}" AS "OrganizationUser"
                                INNER JOIN "${this.userModel.tableName}" AS "User" ON "User"."id" = "OrganizationUser"."user") ON ${this.cols.id} = "OrganizationUser"."organization"
                            LEFT OUTER JOIN "${this.articleModel.tableName}" AS "Article" ON "Article"."author" = "OrganizationUser"."user"
                        WHERE ${this.where}
                        GROUP BY
                            ${this.cols.id}
                        HAVING ${this.having}
                    ) AS "result"
            `), {
                model: this.organizationModel,
                type: QueryTypes.SELECT,
                benchmark: true,
                logging: (sql, timing) => this.addTiming(timing)
            })
        } catch (error) {
            throw new Error(error)
        }
    }
}
