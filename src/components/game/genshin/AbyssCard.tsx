import React, { useState, useEffect } from 'react'
import { formatTime, getNextAbyssReset, getLastAbyssReset } from '../../../utils/timeUtils'
import { useRealTimeTimer } from '../../../hooks/game/genshin/useRealTimeTimer'

export const AbyssCard: React.FC = () => {
    const [isCompleted, setIsCompleted] = useState(false)
    const timeToReset = useRealTimeTimer(getNextAbyssReset)

    // localStorage에서 데이터 로드 및 자동 리셋 체크
    useEffect(() => {
        const savedData = localStorage.getItem('genshin_abyss_data')
        if (savedData) {
            const { completed, lastReset } = JSON.parse(savedData)
            const currentResetTime = getLastAbyssReset()

            // 새로운 리셋 주기가 시작되었으면 초기화
            if (lastReset < currentResetTime) {
                setIsCompleted(false)
                saveAbyssData(false)
            } else {
                setIsCompleted(completed)
            }
        }
    }, [])

    const saveAbyssData = (completed: boolean) => {
        const data = {
            completed,
            lastReset: getLastAbyssReset()
        }
        localStorage.setItem('genshin_abyss_data', JSON.stringify(data))
    }

    const toggleCompletion = () => {
        const newStatus = !isCompleted
        setIsCompleted(newStatus)
        saveAbyssData(newStatus)
    }

    const getStatusColor = () => {
        return isCompleted ? 'bg-green-400 animate-pulse' : 'bg-red-400 animate-pulse'
    }

    const getCurrentPeriod = () => {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        return `${year}년 ${month}월 16일 주기`
    }

    return (
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 border-l-cyan-400 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/30">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <h3 className="text-lg font-bold text-yellow-400">나선비경 (~12층)</h3>
            </div>

            <div className="text-center my-3 text-sm text-cyan-300">
                {getCurrentPeriod()}
            </div>

            <div className="text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                다음 리셋까지 {formatTime(timeToReset)}
            </div>

            <div className="text-center my-4">
                <span className={`text-lg font-bold ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                    {isCompleted ? '✓ 완료' : '✗ 미완료'}
                </span>
            </div>

            <button
                className={`w-full px-3 py-2 rounded transition-colors ${isCompleted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                onClick={toggleCompletion}
            >
                {isCompleted ? '완료 취소' : '완료 표시'}
            </button>

            {isCompleted && (
                <div className="mt-3 text-center text-green-400 text-sm">
                    🎉 나선비경 12층 클리어!
                </div>
            )}

            {timeToReset <= 24 * 60 * 60 * 1000 && ( // 24시간 이내
                <div className="mt-3 text-center text-yellow-400 text-sm animate-pulse">
                    ⚠️ 곧 리셋됩니다!
                </div>
            )}
        </div>
    )
}
