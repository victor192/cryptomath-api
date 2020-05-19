import textFilter from "./text";
import idFilter from "./id";
import idsFilter from "./ids";
import numericFilter from './numeric';
import dateFilter from "./date";

export const getFilter = (type, value) => {
    switch (type) {
        case 'text':
            return textFilter(value)
        case 'id':
            return idFilter(value)
        case 'ids':
            return idsFilter(value)
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
