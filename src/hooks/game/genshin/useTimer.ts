import { useState, useEffect, useRef } from 'react'

export const useTimer = (initialSeconds: number = 0) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<number | null>(null)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        startTimeRef.current = Date.now()
        const targetTime = startTimeRef.current + (timeLeft * 1000)

        intervalRef.current = window.setInterval(() => {
            const now = Date.now()
            const remaining = Math.max(0, Math.ceil((targetTime - now) / 1000))

            setTimeLeft(remaining)

            if (remaining <= 0) {
                setIsRunning(false)
            }
        }, 100)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isRunning, timeLeft])

    const start = () => setIsRunning(true)
    const pause = () => setIsRunning(false)
    const reset = (newTime?: number) => {
        setIsRunning(false)
        setTimeLeft(newTime || initialSeconds)
    }

    return { timeLeft, isRunning, start, pause, reset }
}
