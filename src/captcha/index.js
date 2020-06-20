import limit from "./limit"
import logarithm from "./logarithm"
import integral from "./integral"
import calculus from "./calculus"
import series from "./series"
import summation from "./summation"
import {
    outputLog
} from "../utils/console"

const tasksObject = {
    [limit.name]: limit.tasks,
    [logarithm.name]: logarithm.tasks,
    [integral.name]: integral.tasks,
    [calculus.name]: calculus.tasks,
    [series.name]: series.tasks,
    [summation.name]: summation.tasks
}

const tasks = []

export const loadTasks = () => {
    for (let [groupName, groupTasks] of Object.entries(tasksObject)) {
        groupTasks.forEach(async (t) => {
            await tasks.push(Object.assign({name: groupName}, t))
        })
    }

    outputLog('Captcha tasks was loaded')
}

export const getTasks = () => tasks

export const getTask = (name, id) => tasks.find(t => t.name === name && t.id === id) || false
