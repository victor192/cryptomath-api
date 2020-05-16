const dateFilter = (value) => {
    const filter = {}

    if (value.start) {
        filter.start = new Date(value.start)
    }

    if (value.end) {
        filter.end = new Date(value.end)
    }

    if (filter.start || filter.end) {
        return filter
    }

    return false
}

export default dateFilter
