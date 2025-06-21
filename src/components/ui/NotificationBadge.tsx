import React from 'react'

interface NotificationBadgeProps {
    count?: number
    show: boolean
    type?: 'warning' | 'danger' | 'info'
    children: React.ReactNode
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    dot?: boolean
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    count = 0,
    show,
    type = 'danger',
    children,
    position = 'top-right',
    dot = false
}) => {
    if (!show) return <>{children}</>

    const getBadgeColor = () => {
        switch (type) {
            case 'warning': return 'bg-yellow-500'
            case 'danger': return 'bg-red-500 animate-pulse'
            case 'info': return 'bg-blue-500'
            default: return 'bg-red-500'
        }
    }

    const getPositionClasses = () => {
        switch (position) {
            case 'top-right': return '-top-2 -right-2'
            case 'top-left': return '-top-2 -left-2'
            case 'bottom-right': return '-bottom-2 -right-2'
            case 'bottom-left': return '-bottom-2 -left-2'
            default: return '-top-2 -right-2'
        }
    }

    return (
        <div className="relative inline-block">
            {children}
            <div
                className={`absolute ${getPositionClasses()} ${getBadgeColor()} text-white text-xs font-bold rounded-full flex items-center justify-center min-w-5 h-5 px-1 border-2 border-white shadow-lg z-10 ${dot ? 'w-3 h-3 min-w-3' : ''
                    }`}
            >
                {!dot && (count > 99 ? '99+' : count > 0 ? count : '!')}
            </div>
        </div>
    )
}
