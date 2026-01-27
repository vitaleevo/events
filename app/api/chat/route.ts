import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message } = await request.json();
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp', // Updated model as 3 might not be avail public or use generic
            contents: message,
            config: {
                systemInstruction: `You are a helpful assistant for the "Own Your Financial Future" Masterclass by Dr. Jonathan Vance. 
        The event is on Feb 14, 2025. It covers mindset, investing, wealth creation, and debt management. 
        Be professional, encouraging, and concise. Your goal is to help users decide to register for the free masterclass.`,
                temperature: 0.7,
            },
        });

        const text = response.text || "I'm having trouble connecting. Feel free to register anyway – it's free!";
        return NextResponse.json({ reply: text });

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
