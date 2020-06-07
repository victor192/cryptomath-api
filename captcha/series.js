const {randomInt, binomial} = require('../utils/math')

export default {
    name: 'series',
    tasks: [
        {
            id: 1,
            difficulty: 1,
            generate: () => {
                const a = randomInt(1, 10)
                const b = randomInt(2, 7)
                const c = randomInt(1, 6)

                return [a, b]
            },
            math: (a, b, c) => String.raw`\sum\limits_{k = 0}^{${a}} {${a} \choose k} + \sum\limits_{k = 1}^{${b}} k {${b} \choose k} + \sum\limits_{k = 0}^{${c}} {${c} \choose k}^2`,
            answer: (a, b, c) => Math.pow(2, a) + b * Math.pow(2, (b - 1)) + binomial(2 * c, c)
        },
        {
            id: 2,
            difficulty: 1,
            generate: () => {
                const n = randomInt(3, 9999)

                return [n]
            },
            math: (n) => String.raw`\sum\limits_{k = 0}^{${n}} (-1)^{${n} - k} \, 2^{2 k} {${n} + k + 1 \choose 2k + 1}`,
            answer: (n) => n + 1
        },
        {
            id: 3,
            difficulty: 1,
            generate: () => {
                const k = 2 * randomInt(1, 11)
                const n = k + randomInt(2, 37)

                return [n, k]
            },
            math: (n, k) => String.raw`\sum\limits_{i = 0}^{${k}} (-1)^i {${n} \choose ${k} - i} {${n} \choose i}`,
            answer: (n, k) => {
                if (k % 2 === 0) {
                    const half = Math.floor(k / 2)

                    return Math.pow(-1, half) * binomial(n, half)
                }

                return 0
            }
        }
    ]
}
