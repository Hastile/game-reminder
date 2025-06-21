import { useState, useEffect, useCallback } from 'react'

interface GameNotification {
    gameName: string
    type: 'resin' | 'expedition' | 'weekly' | 'abyss' | 'theater'
    level: 'info' | 'warning' | 'danger'
    message: string
    timestamp: number
    persistent: boolean
    threshold?: number
}

export const useGameNotifications = () => {
    const [notifications, setNotifications] = useState<GameNotification[]>([])
    const [forceUpdate, setForceUpdate] = useState(0)
    const [isInitialized, setIsInitialized] = useState(false)

    const triggerUpdate = useCallback(() => {
        setForceUpdate(prev => prev + 1)
    }, [])

    const saveNotifications = useCallback((newNotifications: GameNotification[]) => {
        localStorage.setItem('game_notifications', JSON.stringify(newNotifications))
        setNotifications([...newNotifications])
        triggerUpdate()
    }, [triggerUpdate])

    useEffect(() => {
        if (!isInitialized) {
            const saved = localStorage.getItem('game_notifications')
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    const filtered = parsed.filter((n: GameNotification) => {
                        if (n.persistent) return true
                        return Date.now() - n.timestamp < 24 * 60 * 60 * 1000
                    })
                    setNotifications(filtered)
                } catch (e) {
                    console.error('알림 로드 실패:', e)
                }
            }
            setIsInitialized(true)
            triggerUpdate()
        }
    }, [isInitialized, triggerUpdate])

    const checkResinStatus = useCallback((gameName: string, currentResin: number): boolean => {
        const resinNotifications = notifications.filter(n =>
            n.gameName === gameName && n.type === 'resin'
        )

        if (currentResin < 160 && resinNotifications.length > 0) {
            const filtered = notifications.filter(n =>
                !(n.gameName === gameName && n.type === 'resin')
            )

            saveNotifications(filtered)
            return true
        }

        return false
    }, [notifications, saveNotifications])

    const addNotification = useCallback((notification: Omit<GameNotification, 'timestamp' | 'persistent'>) => {
        const isPersistent = notification.type === 'resin' &&
            (notification.level === 'warning' || notification.level === 'danger')

        const newNotification: GameNotification = {
            ...notification,
            timestamp: Date.now(),
            persistent: isPersistent,
            threshold: notification.type === 'resin' ? 160 : undefined
        }

        const filtered = notifications.filter(n =>
            !(n.gameName === notification.gameName && n.type === notification.type)
        )

        const updated = [...filtered, newNotification]
        saveNotifications(updated)
    }, [notifications, saveNotifications])

    const resolveNotification = useCallback((gameName: string, type: string) => {
        const filtered = notifications.filter(n =>
            !(n.gameName === gameName && n.type === type)
        )

        saveNotifications(filtered)
    }, [notifications, saveNotifications])

    const syncNotificationState = useCallback((gameName: string, currentValue: number, type: 'resin' | 'expedition') => {
        if (type === 'resin') {
            if (currentValue >= 160) {
                const hasResinNotification = notifications.some(n =>
                    n.gameName === gameName && n.type === 'resin'
                )

                if (!hasResinNotification) {
                    const level = currentValue >= 190 ? 'danger' : 'warning'
                    const message = currentValue >= 200 ? '레진이 가득 찼습니다!' :
                        currentValue >= 190 ? '레진이 190 이상입니다!' :
                            currentValue >= 180 ? '레진이 180 이상입니다!' :
                                '레진이 160 이상입니다!'

                    addNotification({
                        gameName,
                        type: 'resin',
                        level,
                        message
                    })
                }
            } else {
                checkResinStatus(gameName, currentValue)
            }
        }
    }, [notifications, addNotification, checkResinStatus])

    const getGameNotificationInfo = useCallback((gameName: string) => {
        const gameNotifications = notifications.filter(n => n.gameName === gameName)
        const count = gameNotifications.length

        const hasWarning = gameNotifications.some(n => n.level === 'warning')
        const hasDanger = gameNotifications.some(n => n.level === 'danger')

        let level: 'info' | 'warning' | 'danger' = 'info'
        if (hasDanger) level = 'danger'
        else if (hasWarning) level = 'warning'

        return { count, level, hasNotifications: count > 0 }
    }, [notifications])

    return {
        notifications,
        addNotification,
        checkResinStatus,
        resolveNotification,
        getGameNotificationInfo,
        syncNotificationState
    }
}
