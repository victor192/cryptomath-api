const { Op } = require("sequelize")

import numericFilter from './numeric';
import dateFilter from "./date";

export const getFilter = (type, value) => {
    switch (type) {
        case 'text':
            return {
                operators: {
                    [Op.iLike]: `%${String(value)}%`
                }
            }
        case 'id':
            return {id: parseInt(value)}
        case 'ids':
            if (Array.isArray(value)) {
                return {ids: value.map(id => parseInt(id))}
            }
            break
        case 'numeric':
            return numericFilter(value)
        case 'date':
            return dateFilter(value)
    }

    return false
}

export const getFilters = (fields, values) => {
    const filters = []

    for (let [field, value] of Object.entries(values)) {
        const fieldObject = fields.find(f => f.field === field)

        if (fieldObject) {
            const filter = getFilter(fieldObject.type, value)

            if (filter) {
                filters.push({field: fieldObject.field, ...filter})
            }
        }
    }

    return filters
}

export const getSorts = (fields, values) => {
    const sorts = []

    for (let value of values) {
        const fieldObject = fields.find(f => f.field === value.field)

        if (fieldObject && fieldObject.sortable) {
            const order = (value.order === 'asc') ? 'ASC' : 'DESC'

            sorts.push({field: value.field, order})
        }
    }

    return sorts
}
