'use client'
import { useState } from 'react'

export default function ChatWidget() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        if (!input.trim() || loading) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            })

            if (!res.body) throw new Error('No response')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let botText = ''

            setMessages(prev => [...prev, { role: 'assistant', content: '' }])

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                botText += chunk

                setMessages(prev => {
                    const updated = [...prev]
                    updated[updated.length - 1] = { role: 'assistant', content: botText }
                    return updated
                })
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Կապի խնդիր։ Փորձիր նորից։' }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#fff',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                    zIndex: 999,
                    transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {open ? '✕' : '💬'}
            </button>

            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '90px',
                        right: '20px',
                        width: '360px',
                        height: '500px',
                        background: '#fff',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        zIndex: 998,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            padding: '16px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>🤖</span>
                        LikeHub AI
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f9fafb' }}>
                        {messages.length === 0 && (
                            <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '13px', marginTop: '40px' }}>
                                <p style={{ fontSize: '32px', marginBottom: '8px' }}>👋</p>
                                <p>Բարև՛։ Ես LikeHub AI-ն եմ։</p>
                                <p>Ինչո՞վ կարող եմ օգնել։</p>
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    padding: '10px 14px',
                                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: m.role === 'user' ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#fff',
                                    color: m.role === 'user' ? '#fff' : '#1a1a1a',
                                    fontSize: '13px',
                                    lineHeight: '1.4',
                                    boxShadow: m.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', color: '#9ca3af', fontSize: '12px', padding: '8px 12px' }}>
                                AI-ն գրում է...
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '8px' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Գրիր հարցդ..."
                            style={{
                                flex: 1,
                                padding: '10px 14px',
                                borderRadius: '999px',
                                border: '1px solid #e5e7eb',
                                fontSize: '13px',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                color: '#fff',
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '16px',
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            ↑
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}