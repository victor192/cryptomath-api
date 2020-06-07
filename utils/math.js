export const randomInt = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1)

    return Math.round(rand)
}

export const factorial = (x) => {
    if (x === 0) {
        return 1
    }

    return x * factorial(x-1)
}

export const binomial = (n, k) => {
    const numerator = factorial(n)
    const denominator = factorial(n - k) *  factorial(k)

    return Math.floor(numerator / denominator)
}
