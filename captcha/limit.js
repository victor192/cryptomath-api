const {randomInt} = require('../utils/math')

export default {
    name: 'limit',
    tasks: [
        {
            id: 0,
            difficulty: 1,
            generate: () => {
                const m = randomInt(2, 1024)
                const n = m * randomInt(1, 4)

                return [m, n]
            },
            math: (m, n) => String.raw`\lim_{x \to 1} \frac{\sqrt[${m}]{x} - 1}{\sqrt[${n}]{x} - 1}`,
            answer: (m, n) => parseInt(n / m)
        },
        {
            id: 1,
            difficulty: 2,
            generate: () => {
                const b = randomInt(1, 99)
                const a = b + randomInt(1, 73)

                return [a, b]
            },
            math: (a, b) => {
                const m = 3 * a * b

                return String.raw`${m} \cdot \lim_{x \to 0} \frac{1}{x \sqrt{x}} \Bigg ( \sqrt{${a}} \arctan \sqrt{\frac{x}{${a}}} - \sqrt{${b}} \arctan \sqrt{\frac{x}{${b}}} \; \Bigg )`
            },
            answer: (a, b) => a - b
        }
    ]
}
