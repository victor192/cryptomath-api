export const prepareWhere = (wheres, and = false) => {
    const whereQuery = wheres.length ? wheres.map(whereObject => {
        const column = whereObject.column
        const filter = whereObject.filter
        const operation = filter.operation

        return `(${column} ${operation})`
    }).join(` AND `) : '1=1'

    return and ? `AND ${whereQuery}` : whereQuery
}

export const prepareOrder = (orders) => {
    return orders.map(orderObject => {
        const column = orderObject.column
        const direction = orderObject.direction

        return `${column} ${direction}`
    }).join(', ')
}

export const prepareQuery = query => query.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s\s+/g,' ')
