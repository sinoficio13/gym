'use client';

import { useState } from 'react';
import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarView } from "@/components/admin/CalendarView";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ today: 0, week: 0, clients: 0 });
    const [loading, setLoading] = useState(true);

    const handleStatsUpdate = (newStats: { today: number, week: number, clients: number }) => {
        setStats(newStats);
        setLoading(false);
    };

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '24px', fontWeight: 'bold' }}>Panel de Control</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <GlassCard style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--md-sys-color-primary)' }}>
                        {loading ? '...' : stats.today}
                    </h3>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Citas (En Vista)</p>
                </GlassCard>
                <GlassCard style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--md-sys-color-primary)' }}>
                        {loading ? '...' : stats.week}
                    </h3>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Total Citas</p>
                </GlassCard>
                <GlassCard style={{ textAlign: 'center', padding: '24px' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--md-sys-color-primary)' }}>
                        {loading ? '...' : stats.clients}
                    </h3>
                    <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Clientes (Vistos)</p>
                </GlassCard>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Calendario de Citas</h2>
            <CalendarView onStatsUpdate={handleStatsUpdate} />
        </div>
    );
};
