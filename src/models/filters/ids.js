const idsFilter = (value) => {
    if (Array.isArray(value)) {
        const ids = value.map(id => parseInt(id))

        return {
            ids,
            operation: `IN (${ids.join(',')})`
        }
    }

    return false
}

export default idsFilter
