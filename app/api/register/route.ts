import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    consent: z.boolean().refine(val => val === true, {
        message: 'You must consent to participate'
    })
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate with Zod
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: result.error.issues.map((e: z.ZodIssue) => e.message)
            }, { status: 400 });
        }

        const { name, email, phone } = result.data;

        // Save to DB
        const newSubscriber = db.add({ name, email, phone: phone || '' });

        // Simulate delay for effect
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Return success
        return NextResponse.json({ success: true, message: 'Registration confirmed', data: newSubscriber });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



