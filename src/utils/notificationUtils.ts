// 브라우저 알림 권한 요청
export const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
        console.warn('이 브라우저는 알림을 지원하지 않습니다.')
        return false
    }

    if (Notification.permission === 'granted') {
        return true
    }

    if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
    }

    return false
}

// 레진 알림 전송
export const sendResinNotification = (resin: number, timeToFull: number) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return
    }

    let title = ''
    let body = ''
    let icon = '/images/icons/genshin.png'

    if (resin >= 200) {
        title = '🚨 레진 가득참!'
        body = '레진이 200에 도달했습니다. 즉시 소모하세요!'
    } else if (resin >= 190) {
        title = '⚠️ 레진 임계점!'
        body = `레진 ${resin}/200. 약 ${Math.ceil(timeToFull / (60 * 1000))}분 후 가득참`
    } else if (resin >= 180) {
        title = '⏰ 레진 주의!'
        body = `레진 ${resin}/200. 약 ${Math.ceil(timeToFull / (60 * 1000))}분 후 가득참`
    } else if (resin >= 160) {
        title = '📢 레진 경고!'
        body = `레진 ${resin}/200. 손실 위험 구간입니다.`
    }

    if (title && body) {
        new Notification(title, {
            body,
            icon,
            badge: icon,
            tag: 'resin-alert', // 중복 알림 방지
            requireInteraction: resin >= 190, // 190 이상일 때는 사용자 액션 필요
            silent: false
        })
    }
}

// 모바일 진동 알림
export const triggerMobileVibration = (pattern: number[] = [200, 100, 200]) => {
    if ('navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate(pattern)
    }
}

// PWA 설치 가능 여부 확인
export const isPWAInstallable = (): boolean => {
    return 'serviceWorker' in navigator && 'PushManager' in window
}
