export const randomInt = (min, max) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1)

    return Math.round(rand)
}

export const factorial = (n) => {
    let val = 1

    for (let i = 2; i <= n; i++) {
        val *= i
    }

    return val
}

export const binomial = (n, k) => {
    const numerator = factorial(n)
    const denominator = factorial(n - k) *  factorial(k)

    return Math.floor(numerator / denominator)
}
