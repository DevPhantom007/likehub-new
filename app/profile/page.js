import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Profile() {
    const session = await auth()
    if (!session) redirect('/')

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            posts: { include: { likes: true, saves: true } },
            followers: true,
            following: true,
            notifications: { orderBy: { createdAt: 'desc' }, take: 10 }
        }
    })

    const totalLikes = user.posts.reduce((a, p) => a + p.likes.length, 0)
    const totalViews = user.posts.reduce((a, p) => a + p.views, 0)
    const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    const avIdx = (user.name.charCodeAt(0) % 8) + 1

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
                        <a href="/trending" className="btn-ghost">Trending</a>
                        <a href="/saved" className="btn-ghost">Saved</a>
                        <a href="/profile" className="btn-ghost" style={{ background: '#f3f4f6', color: '#1a1a1a' }}>Profile</a>
                    </nav>
                </div>
            </header>

            <main className="max-w-[640px] mx-auto px-6 py-10">
                <div className="card p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`avatar av-${avIdx} w-16 h-16 text-2xl shrink-0`}>
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                                {user.name}
                            </h1>
                            <p className="text-sm" style={{ color: '#6b7280' }}>{user.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl p-4" style={{ background: '#f9fafb' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>POSTS</p>
                            <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{user.posts.length}</p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#fdf2f8' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: '#9d174d' }}>LIKES</p>
                            <p className="text-2xl font-bold" style={{ color: '#ec4899' }}>{totalLikes}</p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#eef2ff' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: '#4338ca' }}>FOLLOWERS</p>
                            <p className="text-2xl font-bold" style={{ color: '#6366f1' }}>{user.followers.length}</p>
                        </div>
                        <div className="rounded-xl p-4" style={{ background: '#ecfdf5' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: '#065f46' }}>VIEWS</p>
                            <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{totalViews}</p>
                        </div>
                    </div>
                </div>

                {user.notifications.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-base font-bold mb-4" style={{ color: '#1a1a1a' }}>
                            🔔 Recent activity
                        </h2>
                        <div className="space-y-2">
                            {user.notifications.map(n => (
                                <div key={n.id} className="text-sm px-3 py-2 rounded-lg" style={{ background: n.read ? '#f9fafb' : '#fef3c7', color: '#4b5563' }}>
                                    {n.text}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
