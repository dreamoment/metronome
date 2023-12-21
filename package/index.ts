type Callback = (delta: number) => void


class Clock {

    static code: string = `
        self.onmessage = e => {
            const interval = e.data
            let date = Date.now()
            while (true) {
                const now = Date.now()
                if (now - date >= interval) {
                    self.postMessage(now - date)
                    date = now
                }
            }
        }
    `

    interval: number = 1000
    worker?: Worker
    callback?: Callback

    constructor() {}

    register(callback: Callback) {
        this.callback = callback
    }

    create(interval: number) {
        this.close()
        this.interval = interval
        const blob = new Blob([Clock.code])
        const url = URL.createObjectURL(blob)
        this.worker = new Worker(url)
        this.worker.onmessage = e => {
            const data = e.data
            this.callback && this.callback(data)
        }
        this.worker.onerror = e => {
            console.error(e)
        }
    }

    start() {
        this.worker?.postMessage(this.interval)
    }
    
    close() {
        this.worker?.terminate()
    }
}

class Metronome {

    FPS: number
    deltaFixed: number
    enable: boolean = false
    enableRunningInBG: boolean = false
    clock: Clock

    constructor(FPS: number) {
        this.FPS = FPS
        this.deltaFixed = 1 / this.FPS
        this.clock = new Clock()
    }

    on(callback: Callback) {
        this.clock.register((delta: number) => {
            const _delta =  delta / 1000
            if (document.visibilityState === 'hidden') {
                if (this.enableRunningInBG) {
                    callback(_delta)
                }
            }
            else {
                callback(_delta)
            }
        })
    }

    start() {
        this.clock.create(this.deltaFixed * 1000)
        this.clock.start()
        this.enable = true
    }

    stop() {
        this.clock.close()
        this.enable = false
    }

    setFPS(FPS: number) {
        this.FPS = FPS
        this.deltaFixed = 1 / this.FPS
        this.clock.create(this.deltaFixed * 1000)
        if (this.enable) {
            this.clock.start()
        }
    }

    allowRunningInBG(enable: boolean) {
        this.enableRunningInBG = enable
    }

    dispose() {
        this.stop()
    }
}


export default Metronome