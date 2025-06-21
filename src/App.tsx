import { useState, useCallback } from 'react'
import { GenshinTimers } from './components/GenshinTimers'
import { useGameNotifications } from './hooks/useGameNotifications'
import { NotificationBadge } from './components/ui/NotificationBadge'
import './App.css'

function App() {
  const [selectedGame, setSelectedGame] = useState<string>('원신')
  const { getGameNotificationInfo } = useGameNotifications()

  const games = [
    { name: '원신', icon: 'genshin.png' },
    { name: '붕괴 : 스타레일', icon: 'starrail.png' },
    { name: '명조 : 워더링 웨이브', icon: 'wutheringwave.png' },
    { name: '명일방주', icon: 'arknights.png' },
    { name: '블루 아카이브', icon: 'bluearchive.png' },
    { name: '드래곤볼 Z 폭렬격전', icon: 'dragonballz.png' }
  ]

  const handleGameSelect = useCallback((gameName: string) => {
    setSelectedGame(gameName)
  }, [])

  const handleNotification = useCallback((type: string, level: 'warning' | 'danger', message: string) => {
    // 필요시 추가 처리
  }, [])

  return (
    <div className="min-h-screen text-white">
      <div className="relative z-10 max-w-7xl mx-auto p-5">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-green-400 mb-3 drop-shadow-lg">
            게임 리마인더
          </h1>
          <p className="text-white/90 text-lg">통합 타이머 및 알림 시스템</p>
        </header>

        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2">
            {games.map((game) => {
              const notificationInfo = getGameNotificationInfo(game.name)

              return (
                <NotificationBadge
                  key={game.name}
                  show={notificationInfo.hasNotifications}
                  count={notificationInfo.count}
                  type={notificationInfo.level}
                  dot={notificationInfo.level === 'danger'}
                >
                  <div
                    className={`min-w-20 h-20 rounded-full border-3 cursor-pointer transition-all duration-300 flex items-center justify-center text-xs font-bold relative flex-shrink-0 overflow-hidden ${selectedGame === game.name
                        ? 'border-green-400 shadow-lg shadow-green-400/50 scale-105'
                        : 'border-transparent bg-gradient-to-br from-purple-500 to-blue-600 hover:border-yellow-400 hover:scale-110 hover:shadow-lg hover:shadow-yellow-400/50'
                      }`}
                    onClick={() => handleGameSelect(game.name)}
                  >
                    <img
                      src={`/images/icons/${game.icon}`}
                      alt={game.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs font-bold text-center px-1">${game.name.length > 6 ? game.name.substring(0, 6) + '...' : game.name}</span>`;
                        }
                      }}
                    />

                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs opacity-0 hover:opacity-100 transition-opacity bg-black/80 px-3 py-1 rounded-lg whitespace-nowrap">
                      {game.name}
                    </div>
                  </div>
                </NotificationBadge>
              )
            })}

            <div className="min-w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 border-3 border-white/30 cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold flex-shrink-0 ml-4 hover:scale-110 hover:shadow-lg hover:shadow-red-400/50">
              +
            </div>
          </div>

          <div className="text-center text-white/70 text-sm mt-6">
            ← 좌우로 스크롤하여 게임을 선택하세요 →
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 min-h-96 border border-white/20 shadow-2xl">
          {selectedGame === '원신' ? (
            <GenshinTimers onNotification={handleNotification} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/80">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <img
                    src={`/images/icons/${games.find(g => g.name === selectedGame)?.icon || 'default.png'}`}
                    alt={selectedGame}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-2xl font-bold">${selectedGame.charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
                <h3 className="text-3xl font-bold mb-3">{selectedGame}</h3>
                <p className="text-lg">이 게임의 타이머는 곧 추가될 예정입니다!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
