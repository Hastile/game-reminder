import React, { useState } from 'react'
import { useResin } from '../../../hooks/game/genshin/useResin'
import { formatTime } from '../../../utils/timeUtils'
import { requestNotificationPermission } from '../../../utils/notificationUtils'

interface ResinCardProps {
    onNotification?: (type: string, level: 'warning' | 'danger', message: string) => void
    onResinStatusChange?: (currentResin: number) => void
    onResolveNotification?: () => void
}

export const ResinCard: React.FC<ResinCardProps> = ({
    onNotification,
    onResinStatusChange,
    onResolveNotification
}) => {
    const {
        currentResin,
        timeToNext,
        notificationPermission,
        updateResin,
        addResin,
        resetResinTimer,
        getTimeToFullResin,
        maxResin
    } = useResin({ onNotification, onResinStatusChange })

    const [inputValue, setInputValue] = useState(currentResin)

    React.useEffect(() => {
        setInputValue(currentResin)
    }, [currentResin])

    const getStatusColor = () => {
        if (currentResin >= maxResin) return 'bg-red-400 animate-pulse'
        if (currentResin >= 190) return 'bg-orange-400 animate-pulse'
        if (currentResin >= 180) return 'bg-yellow-400 animate-pulse'
        if (currentResin >= 160) return 'bg-yellow-400'
        return 'bg-green-400 animate-pulse'
    }

    const getWarningMessage = () => {
        if (currentResin >= maxResin) {
            return { message: '⚠️ 레진이 가득 찼습니다! 즉시 소모하세요!', color: 'text-red-400' }
        } else if (currentResin >= 190) {
            return { message: '🚨 레진 임계점! 곧 가득 찹니다!', color: 'text-orange-400' }
        } else if (currentResin >= 180) {
            return { message: '⏰ 레진 주의! 손실 위험이 높습니다!', color: 'text-yellow-400' }
        } else if (currentResin >= 160) {
            return { message: '📢 레진 경고! 손실 위험 구간입니다!', color: 'text-yellow-400' }
        }
        return null
    }

    const formatNextResinTime = (milliseconds: number) => {
        if (milliseconds <= 0) return '충전 완료'

        const totalSeconds = Math.ceil(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60

        return `${minutes}분 ${seconds.toString().padStart(2, '0')}초`
    }

    const handleResinUpdate = () => {
        updateResin(inputValue)
    }

    const warningInfo = getWarningMessage()

    return (
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 border-l-cyan-400 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/30">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <h3 className="text-lg font-bold text-yellow-400">레진 (Resin)</h3>
                {!notificationPermission && (
                    <button
                        onClick={requestNotificationPermission}
                        className="ml-auto px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                        title="알림 권한 요청"
                    >
                        🔔
                    </button>
                )}
            </div>

            <div className="text-2xl font-bold text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                {currentResin}/{maxResin}
            </div>

            {warningInfo && (
                <div
                    key={`warning-${currentResin}`}
                    className={`text-center my-4 p-3 bg-red-500/20 rounded-lg backdrop-blur-sm border border-red-400/30 ${warningInfo.color} animate-pulse`}
                >
                    <div className="flex items-center justify-between">
                        <span className="flex-1">{warningInfo.message}</span>
                        {onResolveNotification && (
                            <button
                                onClick={onResolveNotification}
                                className="ml-2 px-2 py-1 bg-white/20 rounded text-xs hover:bg-white/30 transition-colors"
                                title="이 알림 해제"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-sm text-white/70 mb-1">다음 레진까지</div>
                <div className="text-lg font-bold">
                    {formatNextResinTime(timeToNext)}
                </div>
            </div>

            <div className="text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-sm text-white/70 mb-1">전체 충전까지</div>
                <div className="text-lg font-bold">
                    {formatTime(getTimeToFullResin())}
                </div>
            </div>

            <div className="flex items-center gap-2 my-4">
                <span className="text-sm">현재 레진:</span>
                <input
                    type="number"
                    min="0"
                    max={maxResin}
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    className="w-20 p-2 rounded bg-white/20 text-white text-center backdrop-blur-sm border border-white/30"
                />
                <button
                    onClick={handleResinUpdate}
                    className="px-3 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 transition-colors backdrop-blur-sm"
                >
                    설정
                </button>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => addResin(20)}
                >
                    +20
                </button>
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => addResin(40)}
                >
                    +40
                </button>
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => addResin(60)}
                >
                    +60
                </button>
                <button
                    className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700 transition-colors"
                    onClick={() => addResin(-20)}
                >
                    -20
                </button>
                <button
                    className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700 transition-colors"
                    onClick={() => addResin(-40)}
                >
                    -40
                </button>
            </div>

            <div className="border-t border-white/20 pt-3">
                <button
                    className="w-full px-3 py-2 bg-orange-600 rounded text-sm hover:bg-orange-700 transition-colors"
                    onClick={() => resetResinTimer()}
                    title="타이머를 현재 시간으로 리셋합니다"
                >
                    🔄 타이머 리셋
                </button>
                <div className="text-xs text-white/60 text-center mt-1">
                    타이머를 현재 시간 기준으로 다시 시작합니다
                </div>
            </div>
        </div>
    )
}
