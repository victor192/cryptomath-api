const textFilter = (value) => {
    const textValue = String(value)

    return {
        value: textValue,
        operation: `ILIKE '%${textValue}%'`
    }
}

export default textFilter
