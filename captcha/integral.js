const {randomInt} = require('../utils/math')

export default {
    name: 'integral',
    tasks: [
        {
            id: 1,
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
            id: 2,
            difficulty: 1,
            generate: () => {
                const m = randomInt(2, 12)
                const n = randomInt(3, 23)

                return [m, n]
            },
            math: (m, n) => {
                const a = 2 * m
                const b = 2 * n

                return String.raw`\exp \Bigg ( {\frac{1}{\pi} \int\limits_{0}^{\pi/2} \ln (${a}^2 \sin^2 x \; + \; ${b}^2 \cos^2 x) \; {d}x} \Bigg )`
            },
            answer: (m, n) => m + n
        },
        {
            id: 3,
            difficulty: 2,
            generate: () => {
                const a = randomInt(1, 11)
                const b = a * randomInt(2, 83)

                return [a, b]
            },
            math: (a, b) => {
                return String.raw`\exp \Bigg ( \int\limits_{0}^{\infty} \frac{\exp (-${a} x) - \exp (-${b} x)}{x} \; {d}x \Bigg )`
            },
            answer: (a, b) => Math.floor(b / a)
        }
    ]
}
