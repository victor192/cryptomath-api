const numericFilter = (value) => {
    const equals = value.equals ? parseInt(value.equals) : false
    const min = value.min ? parseInt(value.min) : false
    const max = value.max ? parseInt(value.max) : false

    if (equals) {
        return {
            equals,
            operation: `= ${equals.toString()}`
        }
    }
    else if (min && !max) {
        return {
            min,
            operation: `>= ${min.toString()}`
        }
    }
    else if (!min && max) {
        return {
            max,
            operation: `<= ${max.toString()}`
        }
    }
    else if (min && max) {
        return {
            min,
            max,
            operation: `BETWEEN ${min.toString()} AND ${max.toString()}`,
        }
    }

    return false
}

export default numericFilter
