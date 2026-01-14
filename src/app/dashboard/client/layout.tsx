'use client';

import { AppShell } from '@/components/layout/AppShell';

// Client Navigation Items
const clientNavItems = [
    { href: '/dashboard/client', label: 'Inicio', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { href: '/dashboard/client/booking', label: 'Reservar', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { href: '/dashboard/client/progress', label: 'Progreso', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> },
    { href: '/dashboard/client/profile', label: 'Perfil', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
];

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [navItems, setNavItems] = useState(clientNavItems);

    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient();
            // Check if user is admin via RPC or Role
            // For safety, let's use the secure RPC if available, or just check role metadata if simple
            // Given I fixed is_admin() RPC, let's use it for true security
            const { data: isAdmin } = await supabase.rpc('is_admin');

            if (isAdmin) {
                setNavItems(prev => [
                    ...prev,
                    {
                        href: '/admin/dashboard',
                        label: 'Volver a Admin',
                        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0 0 18 9 9 0 0 0 0-18z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                    }
                ]);
            }
        };
        checkAdmin();
    }, []);

    return (
        <AppShell
            navItems={navItems}
            title="Eucaris Pereira"
            subtitle="Portal de Cliente"
        >
            {children}
        </AppShell>
    );
}
