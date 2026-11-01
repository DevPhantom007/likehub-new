import { createGroq } from '@ai-sdk/groq'
import { streamText } from 'ai'

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req) {
    const { messages } = await req.json()

    const result = await streamText({
        model: groq('openai/gpt-oss-120b'),
        system: `Դու LikeHub-ի օգնականն ես։ Պատասխանիր կարճ, ընկերական, հայերեն։ 
Եթե հարցը LikeHub-ի մասին է, օգնիր։ Եթե ոչ, ասա՝ «Ես LikeHub-ի օգնականն եմ, միայն LikeHub-ի մասին կարող եմ օգնել»։`,
        messages,
    })

    return result.toTextStreamResponse()
}