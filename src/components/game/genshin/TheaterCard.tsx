import React, { useState, useEffect } from 'react'
import { formatTime, getNextTheaterReset, getLastTheaterReset } from '../../../utils/timeUtils'
import { useRealTimeTimer } from '../../../hooks/game/genshin/useRealTimeTimer'

export const TheaterCard: React.FC = () => {
    const [isCompleted, setIsCompleted] = useState(false)
    const timeToReset = useRealTimeTimer(getNextTheaterReset)

    // localStorage에서 데이터 로드 및 자동 리셋 체크
    useEffect(() => {
        const savedData = localStorage.getItem('genshin_theater_data')
        if (savedData) {
            const { completed, lastReset } = JSON.parse(savedData)
            const currentResetTime = getLastTheaterReset()

            // 새로운 시즌이 시작되었으면 초기화
            if (lastReset < currentResetTime) {
                setIsCompleted(false)
                saveTheaterData(false)
            } else {
                setIsCompleted(completed)
            }
        }
    }, [])

    const saveTheaterData = (completed: boolean) => {
        const data = {
            completed,
            lastReset: getLastTheaterReset()
        }
        localStorage.setItem('genshin_theater_data', JSON.stringify(data))
    }

    const toggleCompletion = () => {
        const newStatus = !isCompleted
        setIsCompleted(newStatus)
        saveTheaterData(newStatus)
    }

    const getStatusColor = () => {
        return isCompleted ? 'bg-green-400 animate-pulse' : 'bg-purple-400 animate-pulse'
    }

    const getCurrentSeason = () => {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()
        return `${year}년 ${month}월 시즌`
    }

    return (
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 border-l-purple-400 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-purple-400/30">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <h3 className="text-lg font-bold text-purple-400">현실 속 환상극</h3>
            </div>

            <div className="text-center my-3 text-sm text-purple-300">
                {getCurrentSeason()}
            </div>

            <div className="text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                다음 시즌까지 {formatTime(timeToReset)}
            </div>

            <div className="text-center my-4">
                <span className={`text-lg font-bold ${isCompleted ? 'text-green-400' : 'text-purple-400'}`}>
                    {isCompleted ? '✓ 완료' : '✗ 미완료'}
                </span>
            </div>

            <button
                className={`w-full px-3 py-2 rounded transition-colors ${isCompleted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                onClick={toggleCompletion}
            >
                {isCompleted ? '완료 취소' : '완료 표시'}
            </button>

            {isCompleted && (
                <div className="mt-3 text-center text-green-400 text-sm">
                    🎭 이번 시즌 환상극 완료!
                </div>
            )}

            {timeToReset <= 24 * 60 * 60 * 1000 && ( // 24시간 이내
                <div className="mt-3 text-center text-yellow-400 text-sm animate-pulse">
                    ⚠️ 곧 새 시즌이 시작됩니다!
                </div>
            )}
        </div>
    )
}
