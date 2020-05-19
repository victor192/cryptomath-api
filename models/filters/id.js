const idFilter = (value) => {
    const id = parseInt(value)

    return {
        id,
        operation: `= ${id.toString()}`
    }
}

export default idFilter
