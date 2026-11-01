'use client'
import { useState } from 'react'
import { deleteNotification } from './actions'

export default function NotificationBell({ notifications }) {
    const [open, setOpen] = useState(false)
    const [localNotifications, setLocalNotifications] = useState(notifications)

    const unreadCount = localNotifications.filter(n => !n.read).length

    const handleDelete = async (id) => {
        setLocalNotifications(prev => prev.filter(n => n.id !== id))
        await deleteNotification(id)
    }

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                className="btn-ghost"
                style={{
                    position: 'relative',
                    fontSize: '18px',
                    padding: '6px 10px',
                    transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                🔔
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            background: '#ec4899',
                            color: '#fff',
                            borderRadius: '999px',
                            fontSize: '10px',
                            fontWeight: '700',
                            padding: '2px 5px',
                            minWidth: '16px',
                            textAlign: 'center',
                            boxShadow: '0 0 0 2px #fff'
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '44px',
                        right: '0',
                        width: '320px',
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '14px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                        zIndex: 100,
                        maxHeight: '420px',
                        overflowY: 'auto',
                        animation: 'fadeIn 0.2s ease'
                    }}
                >
                    <div
                        style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid #f3f4f6',
                            fontWeight: '700',
                            fontSize: '14px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span>Notifications</span>
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>
                            {unreadCount} new
                        </span>
                    </div>

                    {localNotifications.length === 0 && (
                        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '28px', marginBottom: '8px' }}>🔕</p>
                            <p style={{ fontSize: '13px', color: '#9ca3af' }}>No notifications yet</p>
                        </div>
                    )}

                    {localNotifications.map(n => (
                        <div
                            key={n.id}
                            style={{
                                padding: '12px 16px',
                                borderBottom: '1px solid #f9fafb',
                                fontSize: '13px',
                                background: n.read ? '#fff' : '#fef9ff',
                                color: '#1a1a1a',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'background 0.15s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = n.read ? '#fff' : '#fef9ff'}
                        >
                            <span style={{ flex: 1, lineHeight: '1.4' }}>{n.text}</span>
                            <button
                                onClick={() => handleDelete(n.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#d1d5db',
                                    fontSize: '15px',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ec4899'
                                    e.currentTarget.style.background = '#fdf2f8'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#d1d5db'
                                    e.currentTarget.style.background = 'transparent'
                                }}
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}