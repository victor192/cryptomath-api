const { Op } = require("sequelize")

const dateFilter = (value) => {
    const operators = {}

    if (value.equals) {
        operators[Op.eq] = new Date(value.equals)
    }
    else if (value.start && !value.end) {
        operators[Op.gte] = new Date(value.start)
    }
    else if (!value.start && value.end) {
        operators[Op.lte] = new Date(value.end)
    }
    else if (value.start && value.end) {
        operators[Op.between] = [
            new Date(value.start),
            new Date(value.end)
        ]
    }
    else {
        return false
    }

    return {operators}
}

export default dateFilter
