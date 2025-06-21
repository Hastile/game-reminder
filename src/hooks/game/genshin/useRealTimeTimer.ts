import { useState, useEffect } from 'react'

export const useRealTimeTimer = (getNextResetTime: () => number) => {
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        const updateTimer = () => {
            const remaining = getNextResetTime() - Date.now()
            setTimeLeft(Math.max(0, remaining))
        }

        // 즉시 실행
        updateTimer()

        // 1초마다 정확히 업데이트
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [getNextResetTime])

    return timeLeft
}
