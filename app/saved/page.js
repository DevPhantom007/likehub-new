import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import PostCard from '../PostCard'

export default async function Saved() {
    const session = await auth()
    if (!session) redirect('/')

    const saves = await prisma.save.findMany({
        where: { userId: session.user.id },
        include: {
            post: {
                include: {
                    author: true,
                    likes: true,
                    comments: { include: { user: true } },
                    saves: true,
                    hashtags: true
                }
            }
        }
    })

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
                        <a href="/saved" className="btn-ghost" style={{ textDecoration: 'none', background: '#f3f4f6', color: '#1a1a1a' }}>Saved</a>
                        <a href="/profile" className="btn-ghost" style={{ textDecoration: 'none' }}>Profile</a>
                    </nav>
                </div>
            </header>

            <main className="main-container">
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em' }}>📌 Saved</h1>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Posts you saved for later</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {saves.length === 0 && (
                        <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>No saved posts</p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Save posts to see them here</p>
                        </div>
                    )}
                    {saves.map(s => <PostCard key={s.post.id} post={s.post} currentUserId={session.user.id} />)}
                </div>
            </main>
        </div>
    )
}