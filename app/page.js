import { auth } from '@/auth'
import { register, login, logout, createPost } from './actions'
import { prisma } from '@/lib/prisma'
import PostCard from './PostCard'

export default async function Home() {
    const session = await auth()

    // ============ AUTH (Login/Register) ============
    if (!session) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #fdf2f8 100%)' }}>
                <div style={{ width: '100%', maxWidth: '360px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div className="logo-box" style={{ width: '44px', height: '44px', margin: '0 auto 12px' }}>
                            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '800' }}>L</span>
                        </div>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                            Welcome to <span className="gradient-text">LikeHub</span>
                        </h1>
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            Share ideas. Get feedback.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '18px', marginBottom: '12px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Sign in</h2>
                        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input name="email" type="email" placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px' }} required />
                            <input name="password" type="password" placeholder="Password" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px' }} required />
                            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>Sign in</button>
                        </form>
                    </div>

                    <div className="card" style={{ padding: '18px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Create account</h2>
                        <form action={register} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input name="name" placeholder="Your name" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px' }} required />
                            <input name="email" type="email" placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px' }} required />
                            <input name="password" type="password" placeholder="Password" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px' }} required />
                            <button type="submit" className="btn-secondary" style={{ width: '100%', marginTop: '4px' }}>Create account</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    // ============ HOME (Login-ից հետո) ============
    const posts = await prisma.post.findMany({
        include: {
            author: true,
            likes: true,
            comments: { include: { user: true } },
            saves: true,
            hashtags: true
        },
        orderBy: { createdAt: 'desc' }
    })

    const userAvIdx = (session.user.name.charCodeAt(0) % 8) + 1

    return (
        <div style={{ minHeight: '100vh' }}>
            {/* Header */}
            <header className="header">
                <div className="header-inner">
                    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <div className="logo-box">
                            <span style={{ color: '#fff', fontSize: '13px', fontWeight: '800' }}>L</span>
                        </div>
                        <span className="gradient-text" style={{ fontWeight: '700', fontSize: '15px' }}>LikeHub</span>
                    </a>

                    <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <a href="/trending" className="btn-ghost" style={{ textDecoration: 'none' }}>Trending</a>
                        <a href="/saved" className="btn-ghost" style={{ textDecoration: 'none' }}>Saved</a>
                        <a href="/profile" className="btn-ghost" style={{ textDecoration: 'none' }}>Profile</a>
                        <form action={logout}>
                            <button className="btn-ghost">Sign out</button>
                        </form>
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="main-container">
                {/* Search Input - ՆՈՐԸ */}
                <form action="/search" style={{ marginBottom: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            name="q"
                            placeholder="Search posts, tags, users..."
                            style={{
                                width: '100%',
                                padding: '12px 16px 12px 44px',
                                borderRadius: '12px',
                                border: '1px solid #e5e7eb',
                                background: '#ffffff',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '16px' }}>
                            🔍
                        </span>
                    </div>
                </form>

                {/* Greeting */}
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }} className="animate-fade">
                    <div className={`avatar av-${userAvIdx}`} style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                        {session.user.name[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.01em' }}>
                            Hey, {session.user.name.split(' ')[0]} 👋
                        </h1>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>
                            What's on your mind?
                        </p>
                    </div>
                </div>

                {/* Create Post */}
                <form action={createPost} className="card animate-fade" style={{ padding: '14px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input name="title" placeholder="Title" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }} required />
                        <textarea name="content" placeholder="Share your idea..." style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', resize: 'none', fontFamily: 'inherit' }} rows={2} required />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input name="image" placeholder="Image URL" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '13px' }} />
                            <input name="tags" placeholder="Tags: design, idea" style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '13px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
                            <button type="submit" className="btn-primary">Publish</button>
                        </div>
                    </div>
                </form>

                {/* Posts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {posts.length === 0 && (
                        <div className="card animate-fade" style={{ padding: '40px 20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>No posts yet</p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>Be the first to share</p>
                        </div>
                    )}
                    {posts.map(p => <PostCard key={p.id} post={p} />)}
                </div>
            </main>
        </div>
    )
}