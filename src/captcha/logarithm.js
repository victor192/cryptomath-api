const {randomInt} = require('../utils/math')

export default {
    name: 'logarithm',
    tasks: [
        {
            id: 1,
            difficulty: 2,
            generate: () => {
                const p = randomInt(3, 23)
                const m = randomInt(2, 100)

                return [p, m]
            },
            math: (p, m) => {
                const k = Math.pow(p, 2)
                const n = m * k
                const t = Math.pow(p * m, 2)

                return String.raw`${m + n} \cdot \Bigg( \frac{\log_{${m}} ${n}}{\log_{${n}} ${m}} - \frac{\log_{${m}} ${t}}{\log_{${k}} ${m}} \Bigg )`
            },
            answer: (p, m) => m * (1 + Math.pow(p, 2))
        }
    ]
}
