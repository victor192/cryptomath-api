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
            answer: (m) => 9 * Math.pos(m, 3)
        }
    ]
}
