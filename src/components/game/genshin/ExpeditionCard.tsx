import React from 'react'
import { useExpeditions } from '../../../hooks/game/genshin/useExpeditions'
import { formatTime } from '../../../utils/timeUtils'

export const ExpeditionCard: React.FC = () => {
    const { expeditions, startExpedition, completeExpedition, getExpeditionStatus } = useExpeditions()

    return (
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/20 border-l-4 border-l-cyan-400 hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-green-400/30">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <h3 className="text-lg font-bold text-yellow-400">탐사파견 (Expedition)</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
                {expeditions.map(exp => {
                    const { status, timeLeft } = getExpeditionStatus(exp)
                    return (
                        <div
                            key={exp.id}
                            className={`bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors backdrop-blur-sm ${status === '완료!' ? 'bg-green-400/30 border border-green-400' : ''
                                }`}
                            onClick={() => status === '완료!' && completeExpedition(exp.id)}
                        >
                            <div className="text-sm">파견 {exp.id}</div>
                            <div className="text-xs">
                                {status === '진행중' ? formatTime(timeLeft) : status}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-wrap gap-1">
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => {
                        const availableSlot = expeditions.find(exp => !exp.startTime)
                        if (availableSlot) startExpedition(availableSlot.id, 4)
                    }}
                >
                    4시간
                </button>
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => {
                        const availableSlot = expeditions.find(exp => !exp.startTime)
                        if (availableSlot) startExpedition(availableSlot.id, 8)
                    }}
                >
                    8시간
                </button>
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => {
                        const availableSlot = expeditions.find(exp => !exp.startTime)
                        if (availableSlot) startExpedition(availableSlot.id, 12)
                    }}
                >
                    12시간
                </button>
                <button
                    className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700 transition-colors"
                    onClick={() => {
                        const availableSlot = expeditions.find(exp => !exp.startTime)
                        if (availableSlot) startExpedition(availableSlot.id, 20)
                    }}
                >
                    20시간
                </button>
            </div>
        </div>
    )
}
