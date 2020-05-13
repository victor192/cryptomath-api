import {getInstance} from "./index";

export class Stats {
    constructor() {
        this.articleModel = getInstance('Article')
        this.userModel = getInstance('User')
        this.hubModel = getInstance('Hub')
        this.tagModel = getInstance('Tag')

        this.articles = 0
        this.users = 0
        this.hubs = 0
        this.tags = 0
        this.relatedTags = []
    }

    async setData() {
        try {
            this.articles = await this.articleModel.count()
            this.users = await this.userModel.count()
            this.hubs = await this.hubModel.count()
            this.tags = await this.tagModel.count()

            return true
        } catch (error) {
            throw error
        }
    }
}
