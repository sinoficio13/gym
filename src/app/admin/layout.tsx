'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AppShell } from '@/components/layout/AppShell';

// Base Admin Navigation Items
const baseAdminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg> },
    { href: '/admin/users', label: 'Usuarios', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { href: '/admin/schedule', label: 'Horario', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
    // Temporary toggle for testing
    { href: '/dashboard/client', label: 'Ver Como Cliente', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPendingCount = async () => {
            const supabase = createClient();
            const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('subscription_status', 'pendiente');

            if (count) setPendingCount(count);
        };

        fetchPendingCount();

        // Optional: Subscribe to changes? 
        // For now, fetch once on mount is fine. Real-time can be added if requested.
    }, []);

    const navItems = baseAdminNavItems.map(item => {
        if (item.href === '/admin/users') {
            return { ...item, badge: pendingCount };
        }
        return item;
    });

    return (
        <AppShell
            navItems={navItems}
            title="Panel Admin"
            subtitle="Gestión General"
        >
            {children}
        </AppShell>
    );
}
