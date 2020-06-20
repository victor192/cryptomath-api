export const articles = [
    {
        id: 1,
        title: String.raw`Upper bound $x\mapsto\frac{W\left(\frac{2\alpha}{x^2}\right)}{2\alpha}$ for $x\in[0,1]$ Lambert function`,
        abstract: 'test',
        raw: 'test',
        author: 1,
        hubs: [1],
        tags: [1],
        createdAt: '2020-05-06 23:18:42.528+03'
    },
    {
        id: 2,
        title: String.raw`Q: Optimizing blockchain token purchase. Finding maximum value of a function.`,
        abstract: 'test',
        raw: 'test',
        author: 1,
        hubs: [1],
        tags: [2, 3],
        createdAt: '2020-05-07 01:29:42.528+03'
    },
    {
        id: 3,
        title: String.raw`Is $P=NP$ an $NP$-complete problem?`,
        abstract: 'test',
        raw: 'test',
        author: 1,
        hubs: [1],
        tags: [3],
        createdAt: '2020-05-07 07:15:42.528+03'
    },
    {
        id: 4,
        title: String.raw`PHP Best Practices to Follow in 2020`,
        abstract: 'Web development trends seem to be heading more towards server-side scripting languages over client-side scripting languages. And it can be difficult to decide where to start and what to choose.',
        raw: 'ahaha',
        author: 2,
        hubs: [2],
        tags: [4],
        createdAt: '2020-05-08 10:51:42.528+03'
    },
    {
        id: 5,
        title: String.raw`Difference between various blockchain protocols`,
        abstract: 'Blockchain',
        raw: 'test',
        author: 3,
        hubs: [3],
        tags: [5],
        createdAt: '2020-05-09 12:11:42.528+03'
    }
]

export const answers = [
    {
        id: 1,
        article: 1,
        user: 1,
        message: String.raw`12345`,
        createdAt: '2020-05-10 12:11:42.528+03'
    },
    {
        id: 2,
        article: 2,
        user: 1,
        message: String.raw`qwerty 998877665544332211`,
        createdAt: '2020-05-10 12:12:42.528+03'
    },
    {
        id: 3,
        article: 2,
        user: 1,
        message: String.raw`54321`,
        createdAt: '2020-05-10 13:12:42.528+03'
    }
]
