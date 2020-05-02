const {randomInt} = require('../utils/math')

export default {
    name: 'exam',
    tasks: [
        {
            id: 0,
            difficulty: 2,
            generate: () => {
                const p = randomInt(3, 999)
                const m = randomInt(2, 100)

                return {p, m}
            },
            math: (p, m) => {
                const k = Math.pow(p, 2)
                const n = m * k
                const t = Math.pow(p * m, 2)

                return `${m + n} \cdot \Big( \frac{\log_{${m}} ${n}}{\log_{${n}} ${m}} - \frac{\log_{${m}} ${t}}{\log_{${k}} ${m}} \Big )`
            },
            answer: (p, m) => m * (1 + Math.pow(p, 2))
        }
    ]
}
