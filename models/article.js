const { Sequelize, DataTypes } = require('sequelize')

import {getConnection} from "../core/database"
import {getInstance} from "./index";
import {
    articles,
    answers
} from "../tests/articles"
import {
    getFilters,
    getSorts
} from "./filters";

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

export const ArticleTagModel = () => {
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

export const ArticleAnswerModel = () => {
    const db = getConnection()

    return db.define('ArticleAnswer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        article: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        freezeTableName: true,
        tableName: 'ArticlesAnswers',
    })
}

export const ArticleVoteModel = () => {
    const db = getConnection()

    return db.define('ArticleVote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        article: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        vote: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
}

export const ArticleAssociations = (model) => {
    const articleHubModel = getInstance('ArticleHub')
    const articleTagModel = getInstance('ArticleTag')
    const articleAnswerModel = getInstance('ArticleAnswer')
    const articleVoteModel = getInstance('ArticleVote')
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

    //  Article answer associations
    userModel.ArticleAnswer = userModel.hasOne(articleAnswerModel, {
        foreignKey: 'id'
    })

    articleAnswerModel.User = articleAnswerModel.belongsTo(userModel, {
        foreignKey: 'user'
    })

    model.Answer = model.hasMany(articleAnswerModel, {
        foreignKey: 'article',
        constraints: false
    })

    articleAnswerModel.Article = articleAnswerModel.belongsTo(model, {
        foreignKey: 'id',
        constraints: false
    })

    //  Article vote associations
    userModel.ArticleVote = userModel.hasOne(articleVoteModel, {
        foreignKey: 'id'
    })

    articleVoteModel.User = articleVoteModel.belongsTo(userModel, {
        foreignKey: 'user'
    })

    model.Vote = model.hasMany(articleVoteModel, {
        foreignKey: 'article',
        constraints: false
    })

    articleVoteModel.Article = articleVoteModel.belongsTo(model, {
        foreignKey: 'id',
        constraints: false
    })
}

export const ArticleDefaults = async (model) => {
    try {
        for (let article of articles) {
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
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const ArticleHubDefaults = async (model) => {
    try {
        for (let article of articles) {
            for (let id of article.hubs) {
                await model.findOrCreate({
                    where: {article: article.id, hub: id},
                    defaults: {
                        article: article.id,
                        hub: id
                    }
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const ArticleTagDefaults = async (model) => {
    try {
        for (let article of articles) {
            for (let id of article.tags) {
                await model.findOrCreate({
                    where: {article: article.id, tag: id},
                    defaults: {
                        article: article.id,
                        tag: id
                    }
                })
            }
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const ArticleAnswerDefaults = async (model) => {
    try {
        for (let answer of answers) {
            await model.findOrCreate({
                where: {id: answer.id, article: answer.article},
                defaults: {
                    id: answer.id,
                    article: answer.article,
                    user: answer.user,
                    message: answer.message,
                    createdAt: answer.createdAt
                }
            })
        }
    } catch (error) {
        throw new Error(error)
    }
}

const articlesFields = [
    {
        field: 'title',
        type: 'text',
        sortable: true
    },
    {
        field: 'author',
        type: 'id',
        sortable: true
    },
    {
        field: 'hubs',
        type: 'ids',
        sortable: false
    },
    {
        field: 'tags',
        type: 'ids',
        sortable: false
    },
    {
        field: 'answers',
        type: 'numeric',
        sortable: true
    },
    {
        field: 'votes',
        type: 'numeric',
        sortable: true
    },
    {
        field: 'createdAt',
        type: 'date',
        sortable: true
    }
]

export class Articles {
    constructor({filters, sorts, limit, offset}) {
        this.db = getConnection()
        this.articleModel = getInstance('Article')
        this.articleAnswerModel = getInstance('ArticleAnswer')
        this.articleVoteModel = getInstance('ArticleVote')
        this.userModel = getInstance('User')
        this.hubModel = getInstance('Hub')
        this.tagModel = getInstance('Tag')

        this.filters = filters ? getFilters(articlesFields, filters) : []
        this.sorts = sorts ? getSorts(articlesFields, sorts) : []
        this.limit = limit
        this.offset = offset

        this.data = []
        this.total = 0
    }

    get cols() {
        return {
            answers:  this.db.fn("COUNT", this.db.col("ArticleAnswers.id")),
            votes: this.db.fn("SUM", this.db.fn('COALESCE', this.db.col("ArticleVotes.vote"), 0))
        }
    }

    get where() {
        const wheres = {}

        for (let filter of this.filters) {
            switch (filter.field) {
                case 'title':
                case 'createdAt':
                    wheres[filter.field] = filter.operators
                    break
            }
        }

        return wheres
    }

    get userWhere() {
        const filter = this.filters.find(f => f.field === 'author')

        return {...(filter && {id: filter.id})}
    }

    get hubWhere() {
        const filter = this.filters.find(f => f.field === 'hubs')

        return {...(filter && {id: filter.ids})}
    }

    get tagWhere() {
        const filter = this.filters.find(f => f.field === 'tags')

        return {...(filter && {id: filter.ids})}
    }

    get having() {
        const havings = []

        for (let filter of this.filters) {
            switch (filter.field) {
                case 'answers':
                case 'votes':
                    havings.push(Sequelize.where(this.cols[filter.field], filter.operators))
                    break
            }
        }

        return havings
    }

    get order() {
        const orders = []

        for (let sort of this.sorts) {
            switch (sort.field) {
                case 'title':
                case 'createdAt':
                    orders.push([sort.field, sort.order])
                    break
                case 'author':
                    orders.push([this.userModel, 'displayName', sort.order])
                    break
                case 'answers':
                    orders.push([this.cols.answers, sort.order])
                    break
                case 'votes':
                    orders.push([this.cols.votes, sort.order])
                    break
            }
        }

        if (orders.length === 0) {
            orders.push(['createdAt', 'DESC'])
        }

        return orders
    }

    async setData() {
        try {
            const articles = await this.articleModel.findAndCountAll({
                attributes: [
                    'id',
                    'title',
                    'createdAt',
                    [this.cols.answers, "answers"],
                    [this.cols.votes, "votes"]
                ],
                include: [
                    {
                        model: this.userModel,
                        duplicating: false,
                        attributes: ['id', 'displayName', 'hash'],
                        where: this.userWhere
                    },
                    {
                        model: this.hubModel,
                        duplicating: false,
                        attributes: ['id', 'name'],
                        where: this.hubWhere
                    },
                    {
                        model: this.tagModel,
                        duplicating: false,
                        attributes: ['id', 'name', 'hub'],
                        where: this.tagWhere
                    },
                    {
                        model: this.articleAnswerModel,
                        duplicating: false,
                        attributes: []
                    },
                    {
                        model: this.articleVoteModel,
                        duplicating: false,
                        attributes: []
                    }
                ],
                where: this.where,
                group: [
                    'Article.id',
                    'User.email',
                    'User.id',
                    'Hubs.id',
                    'Hubs.ArticleHub.id',
                    'Tags.id',
                    'Tags.ArticleTag.id'
                ],
                having: this.having,
                order: this.order,
                offset: this.offset,
                limit: this.limit
            })

            this.data = articles.rows
            this.total = articles.count

            return true
        } catch (error) {
            throw error
        }
    }
}
