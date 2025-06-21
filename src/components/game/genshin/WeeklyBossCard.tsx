import React, { useState, useEffect } from 'react'
import { formatTime, getNextMondayReset, getLastMonday } from '../../../utils/timeUtils'
import { useRealTimeTimer } from '../../../hooks/game/genshin/useRealTimeTimer'

export const WeeklyBossCard: React.FC = () => {
    const [weeklyBoss, setWeeklyBoss] = useState(0)
    const timeToReset = useRealTimeTimer(getNextMondayReset)

    // localStorage에서 데이터 로드 및 자동 리셋 체크
    useEffect(() => {
        const savedData = localStorage.getItem('genshin_weekly_boss_data')
        if (savedData) {
            const { completed, lastReset } = JSON.parse(savedData)
            const currentWeekStart = getLastMonday()

            // 새로운 주가 시작되었으면 리셋
            if (lastReset < currentWeekStart) {
                setWeeklyBoss(0)
                saveWeeklyBossData(0)
            } else {
                setWeeklyBoss(completed)
            }
        }
    }, [])

    const saveWeeklyBossData = (completed: number) => {
        const data = {
            completed,
            lastReset: getLastMonday()
        }
        localStorage.setItem('genshin_weekly_boss_data', JSON.stringify(data))
    }

    const addWeeklyBoss = () => {
        if (weeklyBoss < 3) {
            const newCount = weeklyBoss + 1
            setWeeklyBoss(newCount)
            saveWeeklyBossData(newCount)
        }
    }

    const resetWeeklyBoss = () => {
        setWeeklyBoss(0)
        saveWeeklyBossData(0)
    }

    const getStatusColor = () => {
        if (weeklyBoss >= 3) return 'bg-green-400 animate-pulse'
        if (weeklyBoss >= 1) return 'bg-yellow-400'
        return 'bg-red-400 animate-pulse'
    }

    return (
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 border-l-cyan-400 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/30">
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <h3 className="text-lg font-bold text-yellow-400">주간보스 (Weekly Boss)</h3>
            </div>

            <div className="text-2xl font-bold text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                {weeklyBoss}/3 완료
            </div>

            <div className="text-center my-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                다음 리셋까지 {formatTime(timeToReset)}
            </div>

            <div className="flex gap-2">
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                    onClick={addWeeklyBoss}
                    disabled={weeklyBoss >= 3}
                >
                    보스 처치 +1
                </button>
                <button
                    className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700 transition-colors"
                    onClick={resetWeeklyBoss}
                >
                    리셋
                </button>
            </div>

            {weeklyBoss >= 3 && (
                <div className="mt-3 text-center text-green-400 text-sm">
                    ✓ 이번 주 주간보스 완료!
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
