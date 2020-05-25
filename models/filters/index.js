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

    if (Array.isArray(values)) {
        for (let filter of values) {
            const field = filter.field
            const value = filter.value

            if (field && value) {
                const fieldObject = fields.find(f => f.field === field)

                if (fieldObject && fieldObject.filter) {
                    const filter = getFilter(fieldObject.filter, value)

                    if (filter) {
                        filters[fieldObject.field] = filter
                    }
                }
            }
        }
    }

    return filters
}

export const getSorts = (fields, values) => {
    const sorts = {}

    if (Array.isArray(values)) {
        for (let sort of values) {
            const field = sort.field
            const direction = sort.direction

            if (field && direction) {
                const fieldObject = fields.find(f => f.field === field)

                if (fieldObject && fieldObject.sortable) {
                    sorts[fieldObject.field] = (direction === 'asc') ? 'ASC' : 'DESC'
                }
            }
        }
    }

    return sorts
}
