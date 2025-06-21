import { useState, useEffect } from 'react'

interface Expedition {
    id: number
    startTime: number | null
    duration: number | null
    isCompleted: boolean
}

export const useExpeditions = () => {
    const [expeditions, setExpeditions] = useState<Expedition[]>([
        { id: 1, startTime: null, duration: null, isCompleted: false },
        { id: 2, startTime: null, duration: null, isCompleted: false },
        { id: 3, startTime: null, duration: null, isCompleted: false },
        { id: 4, startTime: null, duration: null, isCompleted: false },
        { id: 5, startTime: null, duration: null, isCompleted: false }
    ])

    useEffect(() => {
        const savedData = localStorage.getItem('genshin_expeditions_data')
        if (savedData) {
            setExpeditions(JSON.parse(savedData))
        }
    }, [])

    const saveExpeditions = (newExpeditions: Expedition[]) => {
        setExpeditions(newExpeditions)
        localStorage.setItem('genshin_expeditions_data', JSON.stringify(newExpeditions))
    }

    const startExpedition = (id: number, hours: number) => {
        const newExpeditions = expeditions.map(exp =>
            exp.id === id
                ? { ...exp, startTime: Date.now(), duration: hours * 60 * 60 * 1000, isCompleted: false }
                : exp
        )
        saveExpeditions(newExpeditions)
    }

    const completeExpedition = (id: number) => {
        const newExpeditions = expeditions.map(exp =>
            exp.id === id
                ? { ...exp, startTime: null, duration: null, isCompleted: false }
                : exp
        )
        saveExpeditions(newExpeditions)
    }

    const getExpeditionStatus = (expedition: Expedition) => {
        if (!expedition.startTime || !expedition.duration) {
            return { status: '대기중', timeLeft: 0 }
        }

        const elapsed = Date.now() - expedition.startTime
        const remaining = expedition.duration - elapsed

        if (remaining <= 0) {
            return { status: '완료!', timeLeft: 0 }
        }

        return { status: '진행중', timeLeft: remaining }
    }

    return {
        expeditions,
        startExpedition,
        completeExpedition,
        getExpeditionStatus
    }
}
