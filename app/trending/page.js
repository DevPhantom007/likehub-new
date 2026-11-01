import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import PostCard from '../PostCard'

export default async function Trending() {
    const session = await auth()
    if (!session) redirect('/')

    const posts = await prisma.post.findMany({
        include: {
            author: true,
            likes: true,
            comments: { include: { user: true } },
            saves: true,
            hashtags: true
        }
    })

    const sorted = posts.sort((a, b) => b.likes.length - a.likes.length)

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
                        <a href="/trending" className="btn-ghost" style={{ textDecoration: 'none', background: '#f3f4f6', color: '#1a1a1a' }}>Trending</a>
                        <a href="/saved" className="btn-ghost" style={{ textDecoration: 'none' }}>Saved</a>
                        <a href="/profile" className="btn-ghost" style={{ textDecoration: 'none' }}>Profile</a>
                    </nav>
                </div>
            </header>

            <main className="main-container">
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em' }}>🔥 Trending</h1>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Most liked posts</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sorted.length === 0 && (
                        <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>No posts yet</p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Check back later</p>
                        </div>
                    )}
                    {sorted.map(p => <PostCard key={p.id} post={p} currentUserId={session.user.id} />)}
                </div>
            </main>
        </div>
    )
}