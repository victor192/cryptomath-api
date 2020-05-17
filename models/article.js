import { Sequelize, Op, DataTypes } from "sequelize";

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
        tableName: 'Articles'
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

    //  User article associations
    model.User = model.belongsTo(userModel, {
        foreignKey: 'author'
    })

    //  Article hub associations
    model.Hub = model.belongsToMany(hubModel, {
        through: articleHubModel,
        foreignKey: 'article',
        constraints: false
    })

    //  Hub article associations
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

    //  Tag article model
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
        filter: 'text',
        sortable: true
    },
    {
        field: 'author',
        filter: 'id',
        sortable: true
    },
    {
        field: 'hubs',
        filter: 'ids',
        sortable: false
    },
    {
        field: 'tags',
        filter: 'ids',
        sortable: false
    },
    {
        field: 'answers',
        filter: false,
        sortable: true
    },
    {
        field: 'votes',
        filter: false,
        sortable: true
    },
    {
        field: 'createdAt',
        filter: 'date',
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

        this.filters = filters ? getFilters(articlesFields, filters) : {}
        this.sorts = sorts ? getSorts(articlesFields, sorts) : {}
        this.limit = limit
        this.offset = offset

        this.data = []
        this.total = 0
    }

    get cols() {
        return {
            answers:  this.db.fn("COUNT", this.db.col("ArticleAnswers.id")),
            votes: this.db.fn("SUM", this.db.fn('COALESCE', this.db.col("ArticleVotes.vote"), 0)),
            createdAt: this.db.col("Article.createdAt")
        }
    }

    get where() {
        const wheres = {}

        if (this.filters.title) {
            wheres.title = this.filters.title
        }

        if (this.filters.createdAt) {
            wheres[Op.and] = Sequelize.where(Sequelize.fn('DATE', this.cols.createdAt), this.filters.createdAt)
        }

        return wheres
    }

    get userWhere() {
        const wheres = {}

        if (this.filters.author) {
            wheres.id = this.filters.author.id
        }

        return wheres
    }

    get hubWhere() {
        const wheres = {}

        if (this.filters.hubs) {
            wheres.id = this.filters.hubs.ids
        }

        return wheres
    }

    get tagWhere() {
        const wheres = {}

        if (this.filters.tags) {
            wheres.id = this.filters.tags.ids
        }

        return wheres
    }

    get order() {
        const orders = []

        if (this.sorts.title) {
            orders.push(['title', this.sorts.title])
        }

        if (this.sorts.author) {
            orders.push([this.userModel, 'displayName', this.sorts.author])
        }

        if (this.sorts.answers) {
            orders.push([this.cols.answers, this.sorts.answers])
        }

        if (this.sorts.votes) {
            orders.push([this.cols.votes, this.sorts.votes])
        }

        if (this.sorts.createdAt) {
            orders.push([this.cols.createdAt, this.sorts.createdAt])
        }
        else {
            orders.push([this.cols.createdAt, 'DESC'])
        }

        return orders
    }

    async setData() {
        try {
            this.data = await this.articleModel.findAll({
                attributes: [
                    'id',
                    'title',
                    [this.cols.createdAt, "createdAt"],
                    [this.cols.answers, "answers"],
                    [this.cols.votes, "votes"]
                ],
                distinct: true,
                include: [
                    {
                        model: this.userModel,
                        duplicating: false,
                        attributes: ['id', 'displayName', 'hash'],
                        where: this.userWhere,
                    },
                    {
                        model: this.hubModel,
                        duplicating: false,
                        attributes: ['id', 'name'],
                        where: this.hubWhere,
                    },
                    {
                        model: this.tagModel,
                        duplicating: false,
                        attributes: ['id', 'name', 'hub'],
                        where: this.tagWhere,
                    },
                    {
                        model: this.articleAnswerModel,
                        duplicating: false,
                        attributes: [],
                    },
                    {
                        model: this.articleVoteModel,
                        duplicating: false,
                        attributes: [],
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
                order: this.order,
                offset: this.offset,
                limit: this.limit
            })

            this.total = await this.articleModel.count({
                distinct: true,
                include: [
                    {
                        model: this.userModel,
                        duplicating: false,
                        attributes: ['id', 'displayName', 'hash'],
                        where: this.userWhere,
                    },
                    {
                        model: this.hubModel,
                        duplicating: false,
                        attributes: ['id', 'name'],
                        where: this.hubWhere,
                    },
                    {
                        model: this.tagModel,
                        duplicating: false,
                        attributes: ['id', 'name', 'hub'],
                        where: this.tagWhere,
                    },
                    {
                        model: this.articleAnswerModel,
                        duplicating: false,
                        attributes: []
                    },
                    {
                        model: this.articleVoteModel,
                        duplicating: false,
                        attributes: [],
                    }
                ],
                where: this.where,
            })

            return true
        } catch (error) {
            throw error
        }
    }
}
