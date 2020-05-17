const { Op } = require("sequelize")

const numericFilter = (value) => {
    const operators = {}

    if (value.equals) {
        operators[Op.eq] = parseInt(value.equals)
    }
    else if (value.min && !value.max) {
        operators[Op.gte] = parseInt(value.min)
    }
    else if (!value.min && value.max) {
        operators[Op.lte] = parseInt(value.max)
    }
    else if (value.min && value.max) {
        operators[Op.and]  = [
            {
                [Op.gte]: parseInt(value.min)
            },
            {
                [Op.lte]: parseInt(value.max)
            }
        ]
    }
    else {
        return false
    }

    return operators
}

export default numericFilter
