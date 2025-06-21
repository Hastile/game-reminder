import { useState, useEffect, useRef, useCallback } from 'react'
import { sendResinNotification, triggerMobileVibration } from '../../../utils/notificationUtils'

const RESIN_REGEN_INTERVAL = 8 * 60 * 1000 // 8분
const MAX_RESIN = 200

interface ResinHookProps {
    onNotification?: (type: 'resin', level: 'warning' | 'danger', message: string) => void
    onResinStatusChange?: (currentResin: number) => void
}

export const useResin = (props?: ResinHookProps) => {
    const [currentResin, setCurrentResin] = useState(MAX_RESIN)
    const [timeToNext, setTimeToNext] = useState(0)
    const [notificationPermission, setNotificationPermission] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const lastUpdateRef = useRef(Date.now())
    const lastNotificationRef = useRef(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const notificationThresholds = useRef([160, 180, 190, 200])

    // 알림 권한 요청
    useEffect(() => {
        const initNotification = async () => {
            if ('Notification' in window) {
                const hasPermission = Notification.permission === 'granted'
                setNotificationPermission(hasPermission)
            }
        }
        initNotification()
    }, [])

    // 레진 상태 변화 알림 (디버깅 로그 제거)
    const notifyResinStatus = useCallback((newResin: number) => {
        if (newResin >= 200) {
            props?.onNotification?.('resin', 'danger', '레진이 가득 찼습니다!')
        } else if (newResin >= 190) {
            props?.onNotification?.('resin', 'danger', '레진이 190 이상입니다!')
        } else if (newResin >= 180) {
            props?.onNotification?.('resin', 'warning', '레진이 180 이상입니다!')
        } else if (newResin >= 160) {
            props?.onNotification?.('resin', 'warning', '레진이 160 이상입니다!')
        }

        props?.onResinStatusChange?.(newResin)
    }, [props])

    // localStorage에서 초기 데이터 로드
    useEffect(() => {
        if (!isInitialized) {
            const savedData = localStorage.getItem('genshin_resin_data')
            if (savedData) {
                try {
                    const { resin, lastUpdate } = JSON.parse(savedData)
                    setCurrentResin(resin)
                    lastUpdateRef.current = lastUpdate

                    // 초기화 직후 알림 상태 체크
                    setTimeout(() => {
                        notifyResinStatus(resin)
                    }, 100)

                } catch (e) {
                    console.error('레진 데이터 로드 실패:', e)
                }
            }
            setIsInitialized(true)
        }
    }, [isInitialized, notifyResinStatus])

    // currentResin 변경 시마다 알림 체크 (디버깅 로그 제거)
    useEffect(() => {
        if (isInitialized) {
            notifyResinStatus(currentResin)
        }
    }, [currentResin, isInitialized, notifyResinStatus])

    const getTimeToFullResin = useCallback(() => {
        if (currentResin >= MAX_RESIN) return 0
        const remainingResin = MAX_RESIN - currentResin
        return timeToNext + ((remainingResin - 1) * RESIN_REGEN_INTERVAL)
    }, [currentResin, timeToNext])

    // 실시간 레진 증가 및 타이머 업데이트 (안정화)
    useEffect(() => {
        // 기존 인터벌 정리
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        intervalRef.current = setInterval(() => {
            const now = Date.now()
            const elapsed = now - lastUpdateRef.current
            const increments = Math.floor(elapsed / RESIN_REGEN_INTERVAL)

            if (increments > 0) {
                setCurrentResin(prev => {
                    const newResin = Math.min(MAX_RESIN, prev + increments)

                    // 알림 체크 (5분마다 한 번만)
                    if (now - lastNotificationRef.current > 5 * 60 * 1000) {
                        const shouldNotify = notificationThresholds.current.some(threshold =>
                            prev < threshold && newResin >= threshold
                        )

                        if (shouldNotify) {
                            sendResinNotification(newResin, getTimeToFullResin())

                            if (newResin >= 190) {
                                triggerMobileVibration([300, 200, 300, 200, 300])
                            } else if (newResin >= 180) {
                                triggerMobileVibration([200, 100, 200])
                            }

                            lastNotificationRef.current = now
                        }
                    }

                    const saveData = {
                        resin: newResin,
                        lastUpdate: now - (elapsed % RESIN_REGEN_INTERVAL)
                    }
                    localStorage.setItem('genshin_resin_data', JSON.stringify(saveData))

                    return newResin
                })

                lastUpdateRef.current = now - (elapsed % RESIN_REGEN_INTERVAL)
            }

            // 다음 레진까지 남은 시간 계산
            const newTimeToNext = currentResin < MAX_RESIN
                ? RESIN_REGEN_INTERVAL - (elapsed % RESIN_REGEN_INTERVAL)
                : 0

            setTimeToNext(newTimeToNext)
        }, 1000)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [currentResin, getTimeToFullResin]) // 의존성 배열 최소화

    const updateResin = useCallback((newResin: number) => {
        const clampedResin = Math.max(0, Math.min(MAX_RESIN, newResin))
        setCurrentResin(clampedResin)

        const saveData = {
            resin: clampedResin,
            lastUpdate: lastUpdateRef.current
        }
        localStorage.setItem('genshin_resin_data', JSON.stringify(saveData))
    }, [])

    const addResin = useCallback((amount: number) => {
        setCurrentResin(prev => {
            const newResin = Math.max(0, Math.min(MAX_RESIN, prev + amount))

            const saveData = {
                resin: newResin,
                lastUpdate: lastUpdateRef.current
            }
            localStorage.setItem('genshin_resin_data', JSON.stringify(saveData))

            return newResin
        })
    }, [])

    const resetResinTimer = useCallback((newResin?: number) => {
        const resinValue = newResin !== undefined ? newResin : currentResin
        const clampedResin = Math.max(0, Math.min(MAX_RESIN, resinValue))

        setCurrentResin(clampedResin)
        lastUpdateRef.current = Date.now()

        const saveData = {
            resin: clampedResin,
            lastUpdate: Date.now()
        }
        localStorage.setItem('genshin_resin_data', JSON.stringify(saveData))
    }, [currentResin])

    return {
        currentResin,
        timeToNext,
        notificationPermission,
        updateResin,
        addResin,
        resetResinTimer,
        getTimeToFullResin,
        maxResin: MAX_RESIN
    }
}
