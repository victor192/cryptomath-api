import {getConnection} from "../core/database";
import {
    getFilters,
    getSorts
} from "./filters";

export class Benchmark {
    constructor() {
        this.timing = 0
    }

    addTiming(timing) {
        this.timing += parseInt(timing)
    }
}

export class FilteredList extends Benchmark {
    constructor({fields, filters, sorts, limit, offset, search}) {
        super()

        this.db = getConnection()

        this.filters = filters ? getFilters(fields, filters) : {}
        this.sorts = sorts ? getSorts(fields, sorts) : {}
        this.limit = limit
        this.offset = offset
        this.search = search ? String(search) : false

        this.dataProxy = []
        this.totalProxy = 0

        this.timing = 0
    }

    get data() {
        return this.dataProxy
    }

    get total() {
        return this.totalProxy
    }

    set total(totalRaw) {
        if (totalRaw.length > 0) {
            const dataValues = totalRaw[0]['dataValues']

            if (dataValues) {
                this.totalProxy = parseInt(dataValues.total)
            }
        }
    }
}
