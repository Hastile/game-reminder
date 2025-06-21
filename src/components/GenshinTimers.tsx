import React, { useCallback, useEffect } from 'react'
import { useGameNotifications } from '../hooks/useGameNotifications'
import {
    ResinCard,
    ExpeditionCard,
    WeeklyBossCard,
    AbyssCard,
    TheaterCard
} from './game/genshin'

interface GenshinTimersProps {
    onNotification?: (type: string, level: 'warning' | 'danger', message: string) => void
}

export const GenshinTimers: React.FC<GenshinTimersProps> = ({ onNotification }) => {
    const { addNotification, checkResinStatus, resolveNotification, syncNotificationState } = useGameNotifications()

    useEffect(() => {
        const savedData = localStorage.getItem('genshin_resin_data')
        if (savedData) {
            try {
                const { resin } = JSON.parse(savedData)
                syncNotificationState('원신', resin, 'resin')
            } catch (e) {
                console.error('동기화 실패:', e)
            }
        }
    }, [syncNotificationState])

    const handleNotification = useCallback((type: string, level: 'warning' | 'danger', message: string) => {
        addNotification({
            gameName: '원신',
            type: type as any,
            level,
            message
        })

        onNotification?.(type, level, message)
    }, [addNotification, onNotification])

    const handleResinStatusChange = useCallback((currentResin: number) => {
        checkResinStatus('원신', currentResin)
    }, [checkResinStatus])

    const handleResolveNotification = useCallback(() => {
        resolveNotification('원신', 'resin')
    }, [resolveNotification])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResinCard
                onNotification={handleNotification}
                onResinStatusChange={handleResinStatusChange}
                onResolveNotification={handleResolveNotification}
            />
            <ExpeditionCard />
            <WeeklyBossCard />
            <AbyssCard />
            <TheaterCard />
        </div>
    )
}
