'use server'
import { prisma } from '@/lib/prisma'
import { signIn, signOut } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function register(formData) {
    const email = formData.get('email')
    const name = formData.get('name')
    const password = formData.get('password')

    await prisma.user.create({
        data: { email, name, password }
    })

    await signIn('credentials', { email, password, redirectTo: '/' })
}

export async function login(formData) {
    await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirectTo: '/'
    })
}

export async function logout() {
    await signOut({ redirectTo: '/' })
}

export async function createPost(formData) {
    const { auth } = await import('@/auth')
    const session = await auth()
    if (!session) return

    const tagsRaw = formData.get('tags') || ''
    const tags = tagsRaw.split(/[\s,]+/).filter(Boolean).map(t => t.replace('#', ''))

    await prisma.post.create({
        data: {
            title: formData.get('title'),
            content: formData.get('content'),
            authorId: session.user.id,
            image: formData.get('image') || null,
            hashtags: {
                connectOrCreate: tags.map(name => ({
                    where: { name },
                    create: { name }
                }))
            }
        }
    })
    revalidatePath('/')
}

export async function toggleLike(postId) {
    const { auth } = await import('@/auth')
    const session = await auth()
    if (!session) return
    const userId = session.user.id

    const ex = await prisma.like.findFirst({
        where: { postId: Number(postId), userId }
    })

    if (ex) {
        await prisma.like.delete({ where: { id: ex.id } })
    } else {
        await prisma.like.create({ data: { postId: Number(postId), userId } })

        const post = await prisma.post.findUnique({ where: { id: Number(postId) } })
        if (post && post.authorId !== userId) {
            await prisma.notification.create({
                data: {
                    type: 'like',
                    text: `${session.user.name} liked your post`,
                    userId: post.authorId,
                    fromUserId: userId,
                    postId: Number(postId)
                }
            })
        }
    }
    revalidatePath('/')
}

export async function toggleSave(postId) {
    const { auth } = await import('@/auth')
    const session = await auth()
    if (!session) return
    const userId = session.user.id

    const ex = await prisma.save.findFirst({
        where: { postId: Number(postId), userId }
    })

    if (ex) {
        await prisma.save.delete({ where: { id: ex.id } })
    } else {
        await prisma.save.create({ data: { postId: Number(postId), userId } })
    }
    revalidatePath('/')
}

export async function addComment(postId, formData) {
    const { auth } = await import('@/auth')
    const session = await auth()
    if (!session) return

    const post = await prisma.post.findUnique({ where: { id: Number(postId) } })

    await prisma.comment.create({
        data: {
            text: formData.get('text'),
            postId: Number(postId),
            userId: session.user.id,
        }
    })

    if (post && post.authorId !== session.user.id) {
        await prisma.notification.create({
            data: {
                type: 'comment',
                text: `${session.user.name} commented`,
                userId: post.authorId,
                fromUserId: session.user.id,
                postId: Number(postId)
            }
        })
    }
    revalidatePath('/')
}

export async function followUser(followingId) {
    const { auth } = await import('@/auth')
    const session = await auth()
    if (!session) return
    const followerId = session.user.id
    if (followerId === followingId) return

    const ex = await prisma.follow.findFirst({
        where: { followerId, followingId }
    })

    if (ex) {
        await prisma.follow.delete({ where: { id: ex.id } })
    } else {
        await prisma.follow.create({ data: { followerId, followingId } })
        await prisma.notification.create({
            data: {
                type: 'follow',
                text: `${session.user.name} started following you`,
                userId: followingId,
                fromUserId: followerId
            }
        })
    }
    revalidatePath('/')
}