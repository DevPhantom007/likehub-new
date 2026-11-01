import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import PostCard from '../../PostCard'
import FollowButton from '../../FollowButton'

export default async function UserProfile({ params }) {
    const session = await auth()
    if (!session) redirect('/')
    const { id } = await params

    const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
            posts: {
                include: {
                    author: true,
                    likes: true,
                    comments: { include: { user: true } },
                    saves: true,
                    hashtags: true
                },
                orderBy: { createdAt: 'desc' }
            },
            followers: true,
            following: true
        }
    })

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p style={{ color: '#6b7280' }}>User not found</p>
            </div>
        )
    }

    const isFollowing = user.followers.some(f => f.followerId === session.user.id)
    const isMe = user.id === session.user.id
    const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const avIdx = (user.name.charCodeAt(0) % 8) + 1

    return (
        <div style={{ minHeight: '100vh' }}>
            <header className="header">
                <div className="header-inner">
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <div className="logo-box">
                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '800' }}>L</span>
                        </div>
                        <span className="gradient-text" style={{ fontWeight: '700', fontSize: '15px' }}>LikeHub</span>
                    </a>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <a href="/" className="btn-ghost" style={{ textDecoration: 'none' }}>Home</a>
                        <a href="/trending" className="btn-ghost" style={{ textDecoration: 'none' }}>Trending</a>
                        <a href="/saved" className="btn-ghost" style={{ textDecoration: 'none' }}>Saved</a>
                        <a href="/profile" className="btn-ghost" style={{ textDecoration: 'none' }}>My Profile</a>
                    </nav>
                </div>
            </header>

            <main className="main-container">
                <div className="card animate-fade" style={{ padding: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div className={`avatar av-${avIdx}`} style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>
                                {user.name}
                            </h1>
                            <p style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</p>
                        </div>
                        {!isMe && (
                            <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <div style={{ borderRadius: '12px', padding: '14px', background: '#f9fafb', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', marginBottom: '4px' }}>POSTS</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a' }}>{user.posts.length}</p>
                        </div>
                        <div style={{ borderRadius: '12px', padding: '14px', background: '#eef2ff', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: '#4338ca', marginBottom: '4px' }}>FOLLOWERS</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#6366f1' }}>{user.followers.length}</p>
                        </div>
                        <div style={{ borderRadius: '12px', padding: '14px', background: '#ecfdf5', textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', fontWeight: '600', color: '#065f46', marginBottom: '4px' }}>FOLLOWING</p>
                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>{user.following.length}</p>
                        </div>
                    </div>
                </div>

                <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', marginBottom: '12px' }}>
                    Posts
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {user.posts.length === 0 && (
                        <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>No posts yet</p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>This user has not posted anything</p>
                        </div>
                    )}
                    {user.posts.map(p => (
                        <PostCard key={p.id} post={p} currentUserId={session.user.id} />
                    ))}
                </div>
            </main>
        </div>
    )
}