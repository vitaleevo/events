"use client";

import Backoffice from '@/components/Backoffice';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    return (
        <Backoffice onExit={() => router.push('/')} />
    );
}
