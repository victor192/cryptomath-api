import { Op } from "sequelize";
import numericFilter from './numeric';
import dateFilter from "./date";

export const getFilter = (type, value) => {
    switch (type) {
        case 'text':
            return {
                [Op.iLike]: `%${String(value)}%`
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
    const filters = {}

    for (let [field, value] of Object.entries(values)) {
        const fieldObject = fields.find(f => f.field === field)

        if (fieldObject && fieldObject.filter) {
            const filter = getFilter(fieldObject.filter, value)

            if (filter) {
                filters[fieldObject.field] = filter
            }
        }
    }

    return filters
}

export const getSorts = (fields, values) => {
    const sorts = {}

    for (let [field, order] of Object.entries(values)) {
        const fieldObject = fields.find(f => f.field === field)

        if (fieldObject && fieldObject.sortable) {
            const direction = (order === 'asc') ? 'ASC' : 'DESC'

            sorts[fieldObject.field] = direction
        }
    }

    return sorts
}
