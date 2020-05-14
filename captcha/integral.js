const {randomInt} = require('../utils/math')

export default {
    name: 'integral',
    tasks: [
        {
            id: 0,
            difficulty: 2,
            generate: () => {
                const m = randomInt(1, 15)

                return [m]
            },
            math: (m) => {
                const p = 3 * m

                return String.raw`\lim_{\alpha \to 0} \int\limits_{0}^{${p}} x^2 \cos \alpha x \; d{x}`
            },
            answer: (m) => 9 * Math.pow(m, 3)
        },
        {
            id: 1,
            difficulty: 1,
            generate: () => {
                const m = randomInt(2, 12)
                const n = randomInt(3, 23)

                return [m, n]
            },
            math: (m, n) => {
                const a = 2 * m
                const b = 2 * n

                return String.raw`e^{\frac{1}{\pi} \int\limits_{0}^{\pi/2} \ln (${a}^2 \sin^2 x \; + \; ${b}^2 \cos^2 x) \; {d}x}`
            },
            answer: (m, n) => m + n
        }
    ]
}
