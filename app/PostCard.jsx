'use client'
import { toggleLike, toggleSave, addComment } from './actions'
import FollowButton from './FollowButton'
import { useState } from 'react'

export default function PostCard({ post }) {
    const [liked, setLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
    const [saved, setSaved] = useState(false)
    const [saveCount, setSaveCount] = useState(post.saves?.length || 0)

    const handleLike = async () => {
        setLiked(!liked)
        setLikeCount(liked ? likeCount - 1 : likeCount + 1)
        await toggleLike(post.id)
    }

    const handleSave = async () => {
        setSaved(!saved)
        setSaveCount(saved ? saveCount - 1 : saveCount + 1)
        await toggleSave(post.id)
    }

    const initials = post.author.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const avIdx = (post.author.name.charCodeAt(0) % 8) + 1

    return (
        <article className="card animate-fade" style={{ overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={`avatar av-${avIdx}`} style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                        {initials}
                    </div>
                    <div>
                        <p style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.2' }}>{post.author.name}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                <FollowButton targetUserId={post.author.id} isFollowing={false} />
            </div>

            {/* Content */}
            <div style={{ padding: '0 14px 10px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{post.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4b5563' }}>{post.content}</p>

                {post.hashtags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {post.hashtags.map(h => (
                            <a key={h.id} href={`/search?q=${h.name}`} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', fontWeight: '600', background: '#eef2ff', color: '#6366f1', textDecoration: 'none' }}>
                                #{h.name}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Image */}
            {post.image && (
                <div style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', background: '#f9fafb' }}>
                    <img src={post.image} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} loading="lazy" />
                </div>
            )}

            {/* Actions */}
            <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', color: liked ? '#ec4899' : '#6b7280', background: liked ? '#fdf2f8' : 'transparent' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#ec4899' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span>{likeCount}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', fontSize: '13px', fontWeight: '600', color: '#6b7280' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{post.comments?.length || 0}</span>
                </div>

                <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer', marginLeft: 'auto', color: saved ? '#f59e0b' : '#6b7280', background: saved ? '#fffbeb' : 'transparent' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#f59e0b' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{saveCount}</span>
                </button>
            </div>

            {/* Comments */}
            <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #f3f4f6' }}>
                {post.comments?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                        {post.comments.map(c => {
                            const cInitials = c.user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                            const cAvIdx = (c.user.name.charCodeAt(0) % 8) + 1
                            return (
                                <div key={c.id} style={{ display: 'flex', gap: '8px' }}>
                                    <div className={`avatar av-${cAvIdx}`} style={{ width: '28px', height: '28px', fontSize: '10px' }}>
                                        {cInitials}
                                    </div>
                                    <div style={{ flex: 1, borderRadius: '12px', padding: '8px 12px', background: '#f9fafb' }}>
                                        <p style={{ fontSize: '11px', fontWeight: '700', marginBottom: '1px' }}>{c.user.name}</p>
                                        <p style={{ fontSize: '13px', color: '#4b5563' }}>{c.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                <form action={addComment.bind(null, post.id)} style={{ display: 'flex', gap: '6px' }}>
                    <input name="text" placeholder="Write a comment..." style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }} required />
                    <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }}>Post</button>
                </form>
            </div>
        </article>
    )
}