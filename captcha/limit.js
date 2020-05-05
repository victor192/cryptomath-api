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
        },
        {
            id: 2,
            difficulty: 2,
            generate: () => {
                const b = randomInt(1, 12)
                const a = b + randomInt(1, 9)

                return [a, b]
            },
            math: (a, b) => String.raw`\ln \lim_{x \to 0} \Bigg ( \frac{1 + \sin x \cos ${a} x}{1 + \sin x \cos ${b} x} \Bigg )^{\cot^3 x}`,
            answer: (a, b) => Math.pow(b, 2) - Math.pow(a, 2)
        },
        {
            id: 3,
            difficulty: 2,
            generate: () => {
                const a = randomInt(3, 41)
                const b = randomInt(1, 23)
                const c = randomInt(7, 37)

                return [a, b, c]
            },
            math: (a, b, c) => String.raw`\sqrt[3]{\lim_{x \to 0} \Bigg ( \frac{${a}^x + ${b}^x + ${c}^x}{3} \Bigg )^{\frac{1}{x}}}`,
            answer: (a, b, c) => a * b * c
        }
    ]
}
