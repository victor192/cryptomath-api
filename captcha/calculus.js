const {randomInt} = require('../utils/math')

export default  {
    name: 'calculus',
    tasks: [
        {
            id: 1,
            difficulty: 1,
            generate: () => {
                const b = randomInt(2, 783)
                const a = b + randomInt(3, 97)

                return [a, b]
            },
            math: (a, b) => String.raw`${a - b} \cdot \Bigg ( \frac{\sqrt{${a}}}{\sqrt{${a}} + \sqrt{${b}}} + \frac{\sqrt{${b}}}{\sqrt{${a}} - \sqrt{${b}}} \Bigg )`,
            answer: (a, b) => a + b
        }
    ]
}
