export const formatTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return '완료!'

    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return `${days}일 ${hours % 24}시간 ${minutes % 60}분`
    } else if (hours > 0) {
        return `${hours}시간 ${minutes % 60}분 ${seconds % 60}초`
    } else if (minutes > 0) {
        return `${minutes}분 ${seconds % 60}초`
    } else {
        return `${seconds}초`
    }
}

// 주간보스 리셋 (매주 월요일 새벽 4시)
export const getLastMonday = (): number => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now.setDate(diff))
    monday.setHours(4, 0, 0, 0)
    return monday.getTime()
}

export const getNextMondayReset = (): number => {
    const lastMonday = getLastMonday()
    return lastMonday + (7 * 24 * 60 * 60 * 1000)
}

// 나선비경 리셋 (매월 16일 새벽 5시로 고정)
export const getNextAbyssReset = (): number => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // 이번 달 16일 새벽 5시
    let resetDate = new Date(year, month, 16, 5, 0, 0)

    // 현재 시간이 이번 달 16일 이후라면 다음 달 16일로 설정
    if (now >= resetDate) {
        resetDate = new Date(year, month + 1, 16, 5, 0, 0)
    }

    return resetDate.getTime()
}

export const getLastAbyssReset = (): number => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // 이번 달 16일 새벽 5시
    let resetDate = new Date(year, month, 16, 5, 0, 0)

    // 현재 시간이 이번 달 16일 이전이라면 지난달 16일로 설정
    if (now < resetDate) {
        if (month === 0) {
            resetDate = new Date(year - 1, 11, 16, 5, 0, 0) // 작년 12월
        } else {
            resetDate = new Date(year, month - 1, 16, 5, 0, 0) // 지난달
        }
    }

    return resetDate.getTime()
}

// 현실 속 환상극 리셋 (매월 1일 새벽 5시 - 기존 유지)
export const getNextTheaterReset = (): number => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // 다음 달 1일 새벽 5시
    const resetDate = new Date(year, month + 1, 1, 5, 0, 0)
    return resetDate.getTime()
}

export const getLastTheaterReset = (): number => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    // 이번 달 1일 새벽 5시
    const resetDate = new Date(year, month, 1, 5, 0, 0)
    return resetDate.getTime()
}

// 현재 시간 기준으로 다음 리셋까지의 시간 계산
export const getTimeUntilReset = (getNextResetFn: () => number): number => {
    return getNextResetFn() - Date.now()
}
