const { DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {articles} from "../tests/articles"

export const ArticleModel = () => {
    const db = getConnection()

    return db.define('Article', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        raw: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        author: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        tableName: 'Articles',
    })
}

export const ArticleHubModel = () => {
    const db = getConnection()

    return db.define('ArticleHub', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        article: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        hub: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'ArticlesHubs',
        timestamps: false
    })
}

export const ArticleTagModel = (model) => {
    const db = getConnection()

    return db.define('ArticleTag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        article: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        },
        tag: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        tableName: 'ArticlesTags',
        timestamps: false
    })
}

export const ArticleAssociations = (model) => {
    const articleHubModel = getInstance('ArticleHub')
    const articleTagModel = getInstance('ArticleTag')
    const userModel = getInstance('User')
    const hubModel = getInstance('Hub')
    const tagModel = getInstance('Tag')

    //  Article author associations
    userModel.Article = userModel.hasOne(model, {
        foreignKey: 'id'
    })

    model.User = model.belongsTo(userModel, {
        foreignKey: 'author'
    })

    //  Article hub associations
    /*model.hasMany(articleHubModel, {
        foreignKey: 'article'
    })*/

    /*articleHubModel.Article = articleHubModel.belongsTo(model, {
        foreignKey: 'article'
    })

    articleHubModel.Hub = articleHubModel.belongsTo(hubModel, {
        foreignKey: 'hub',
    })*/

    model.Hub = model.belongsToMany(hubModel, {
        through: articleHubModel,
        foreignKey: 'article',
        constraints: false
    })

    hubModel.Article = hubModel.belongsToMany(model, {
        through: articleHubModel,
        foreignKey: 'hub',
        constraints: false
    })

    //  Article tag associations
    /*articleTagModel.Article = articleTagModel.belongsTo(model, {
        foreignKey: 'article'
    })

    articleTagModel.Tag = articleTagModel.belongsTo(tagModel, {
        foreignKey: 'tag',
    })*/

    model.Tag = model.belongsToMany(tagModel, {
        through: articleTagModel,
        foreignKey: 'article',
        constraints: false
    })

    tagModel.Article = tagModel.belongsToMany(model, {
        through: articleTagModel,
        foreignKey: 'tag',
        constraints: false
    })
}

export const ArticleDefaults = async (model) => {
    try {
        articles.forEach(async (article) => {
            await model.findOrCreate({
                where: {id: article.id},
                defaults: {
                    id: article.id,
                    title: article.title,
                    author: article.author,
                    raw: article.raw,
                    createdAt: article.createdAt
                }
            })
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const ArticleHubDefaults = async (model) => {
    articles.forEach(article => {
        article.hubs.forEach(async (id) => {
            await model.findOrCreate({
                where: {article: article.id, hub: id},
                defaults: {
                    article: article.id,
                    hub: id
                }
            })
        })
    })
}

export const ArticleTagDefaults = async (model) => {
    articles.forEach(article => {
        article.tags.forEach(async (id) => {
            await model.findOrCreate({
                where: {article: article.id, tag: id},
                defaults: {
                    article: article.id,
                    tag: id
                }
            })
        })
    })
}

export class Articles {
    constructor({limit, offset}) {
        this.articleModel = getInstance('Article')
        this.userModel = getInstance('User')
        this.hubModel = getInstance('Hub')
        this.tagModel = getInstance('Tag')
        this.limit = limit
        this.offset = offset
        this.data = []
        this.total = 0
    }

    async setData() {
        try {
            this.data = await this.articleModel.findAll({
                attributes: ['id', 'title', 'createdAt'],
                offset: this.offset,
                limit: this.limit,
                include: [
                    {
                        model: this.userModel,
                        attributes: ['id', 'displayName', 'hash'],
                    },
                    {
                        model: this.hubModel,
                        attributes: ['id', 'name']
                    },
                    {
                        model: this.tagModel,
                        attributes: ['id', 'name', 'hub']
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            this.total = await this.articleModel.count()

            return true
        } catch (error) {
            throw error
        }
    }
}
