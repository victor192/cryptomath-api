import {getInstance} from "./index"
import {Benchmark} from "./mixins"

export class Stats extends Benchmark {
    constructor() {
        super()

        this.articleModel = getInstance('Article')
        this.userModel = getInstance('User')
        this.organizationModel = getInstance('Organization')
        this.hubModel = getInstance('Hub')
        this.tagModel = getInstance('Tag')

        this.articles = 0
        this.users = 0
        this.organizations = 0
        this.hubs = 0
        this.tags = 0

        this.timing = 0
    }

    async count(model) {
        try {
            return await model.count({
                benchmark: true,
                logging: (sql, timing) => this.addTiming(timing)
            })
        } catch (error) {
            throw new Error(error)
        }
    }

    async setData() {
        try {
            this.articles = await this.count(this.articleModel)
            this.users = await this.count(this.userModel)
            this.organizations = await this.count(this.organizationModel)
            this.hubs = await this.count(this.hubModel)
            this.tags = await this.count(this.tagModel)

            return true
        } catch (error) {
            throw new Error(error)
        }
    }
}
