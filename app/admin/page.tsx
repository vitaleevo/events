"use client";

import Backoffice from '@/components/Backoffice';
import { useRouter } from 'next/navigation';
import { LanguageProvider } from '@/components/LanguageContext';

export default function AdminPage() {
    const router = useRouter();

    return (
        <Backoffice onExit={() => router.push('/')} />
    );
}
