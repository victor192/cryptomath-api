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

                return {m, n}
            },
            math: (m, n) => `$$\lim_{x \to 1} \frac{\sqrt[${m}]{x} - 1}{\sqrt[${n}]{x} - 1}$$`,
            answer: (m, n) => parseInt(n / m)
        }
    ]
}
