export const dynamic = 'force-dynamic'
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
        <div className="min-h-screen">
            <header className="sticky top-0 z-20" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb' }}>
                <div className="max-w-[640px] mx-auto px-6 h-16 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' }}>
                            <span style={{ color: '#fff', fontSize: '15px', fontWeight: '800' }}>L</span>
                        </div>
                        <span className="font-bold text-lg gradient-text">LikeHub</span>
                    </a>
                    <nav className="flex items-center gap-1">
                        <a href="/" className="btn-ghost">Home</a>
                        <a href="/trending" className="btn-ghost" style={{ background: '#f3f4f6', color: '#1a1a1a' }}>Trending</a>
                        <a href="/saved" className="btn-ghost">Saved</a>
                        <a href="/profile" className="btn-ghost">Profile</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-[640px] mx-auto px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                        🔥 Trending
                    </h1>
                    <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
                        Most liked posts
                    </p>
                </div>

                <div className="space-y-5">
                    {sorted.length === 0 && (
                        <div className="card p-12 text-center">
                            <p className="text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>No posts yet</p>
                            <p className="text-sm" style={{ color: '#6b7280' }}>Check back later</p>
                        </div>
                    )}
                    {sorted.map(p => <PostCard key={p.id} post={p} />)}
                </div>
            </main>
        </div>
    )
}