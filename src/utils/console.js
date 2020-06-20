const Reset = "\x1b[0m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgRed = "\x1b[31m"

export const outputLog = (message) => console.log(FgGreen, message, Reset)
export const outputWarning = (message) => console.log(FgYellow, message, Reset)
export const outputError = (message) => console.error(FgRed, message, Reset)
