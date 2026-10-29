import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user) return null
                if (user.password !== credentials.password) return null

                return { id: user.id, name: user.name, email: user.email }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id
            return token
        },
        async session({ session, token }) {
            if (token && session.user) session.user.id = token.id
            return session
        }
    },
    pages: {
        signIn: '/'
    },
    secret: process.env.AUTH_SECRET
})