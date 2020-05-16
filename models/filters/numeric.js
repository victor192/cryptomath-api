const numericFilter = (value) => {
    const filter = {}

    if (value.min) {
        filter.min = parseInt(value.min)
    }

    if (value.max) {
        filter.max = parseInt(value.max)
    }

    if (filter.min || filter.max) {
        return filter
    }

    return false
}

export default numericFilter
