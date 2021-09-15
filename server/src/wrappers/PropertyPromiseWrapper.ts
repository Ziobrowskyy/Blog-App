export default function PropertyPromiseWrapper<T>(target: (...args: Array<any>) => undefined | T, interval: number = 100): Promise<T> {
    return new Promise(resolve => {
        let value: any | undefined
        const timer = setInterval(() => {
            value = target()
            if (value) {
                clearInterval(timer)
                resolve(value)
            }
        }, interval)
    })
}