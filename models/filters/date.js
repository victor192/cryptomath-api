import isValid from 'date-fns/isValid'
import formatISO from 'date-fns/formatISO'

const parseDatabaseDate = (value) => {
    const date = new Date(value)

    if (isValid(date)) {
        return formatISO(date, { representation: 'date' })
    }

    return false
}

const dateFilter = (value) => {
    const equals = value.equals ? parseDatabaseDate(value.equals) : false
    const start = value.start ? parseDatabaseDate(value.start) : false
    const end = value.end ? parseDatabaseDate(value.end) : false

    if (equals) {
        return {
            equals,
            operation: `= '${equals}'`
        }
    }
    else if (start && !end) {
        return {
            start,
            operation: `>= '${start}'`
        }
    }
    else if (!start && end) {
        return {
            end,
            operation: `<= '${end}'`
        }
    }
    else if (start && end) {
        return {
            start,
            end,
            operation: `BETWEEN '${start}' AND '${end}'`
        }
    }

    return false
}

export default dateFilter
