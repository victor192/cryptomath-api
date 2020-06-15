const {randomInt} = require('../utils/math')

export default {
    name: 'summation',
    tasks: [
        {
            id: 1,
            difficulty: 1,
            generate: () => {
                const n = randomInt(10, 49497)

                return [n]
            },
            math: (n) => String.raw`6 \cdot \frac{1 \cdot 2 + 2 \cdot 3 + 3 \cdot 4 + \ldots +  ${n} \cdot ${n + 1}}{1 + 2 + 3 + \ldots + ${n}}`,
            answer: (n) => 4 * (n + 2)
        },
        {
            id: 2,
            difficulty: 1,
            generate: () => {
                const n = randomInt(6, 121)

                return [n]
            },
            math: (n) => String.raw`\frac{1}{${n - 3}!} \cdot \Bigg ( 1 - \Bigg ( \frac{1}{2!} + \frac{2}{3!} + \frac{3}{4!} + \ldots + \frac{${n - 1}}{${n}!} \Bigg ) \Bigg )^{-1}`,
            answer: (n) => n * (n - 1) * (n - 2)
        },
        {
            id: 3,
            difficulty: 1,
            generate: () => {
                const k = randomInt(4, 9876)

                return [k]
            },
            math: (k) => {
                const n = 2 * k + 1
                const double = 2 * n

                return String.raw`\sin^2 \frac{\pi}{${double}} + \sin^2 \Big ( 2 \cdot \frac{\pi}{${double}} \Big ) + \sin^2 \Big ( 3 \cdot \frac{\pi}{${double}} \Big ) + \ldots + \sin^2 \Big ( ${n} \cdot \frac{\pi}{${double}} \Big )`
            },
            answer: (k) => k + 1
        }
    ]
}