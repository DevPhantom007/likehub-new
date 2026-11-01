import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import PostCard from '../PostCard'

export default async function SearchPage({ searchParams }) {
    const session = await auth()
    const params = await searchParams
    const q = params.q || ''

    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: q } },
                { content: { contains: q } },
                { hashtags: { some: { name: { contains: q.replace('#', '') } } } }
            ]
        },
        include: {
            author: true,
            likes: true,
            comments: { include: { user: true } },
            saves: true,
            hashtags: true
        },
        orderBy: { createdAt: 'desc' }
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
                    <a href="/" className="btn-ghost" style={{ textDecoration: 'none' }}>← Back</a>
                </div>
            </header>

            <main className="main-container">
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em' }}>
                        Search: "{q}"
                    </h1>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {posts.length} results
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.length === 0 && (
                        <div className="card" style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>Nothing found</p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Try a different search term</p>
                        </div>
                    )}
                    {posts.map(p => <PostCard key={p.id} post={p} currentUserId={session?.user?.id} />)}
                </div>
            </main>
        </div>
    )
}