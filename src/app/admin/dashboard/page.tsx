'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarView } from "@/components/admin/CalendarView";
import styles from './page.module.css';

// Mock data
const stats = [
    { label: "Citas Hoy", value: "3" },
    { label: "Esta Semana", value: "12" },
    { label: "Nuevos Clientes", value: "5" },
];

export default function AdminDashboard() {
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '24px', fontWeight: 'bold' }}>Panel de Control</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
            }}>
                {stats.map((stat, i) => (
                    <GlassCard key={i} style={{ textAlign: 'center', padding: '24px' }}>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--md-sys-color-primary)' }}>{stat.value}</h3>
                        <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{stat.label}</p>
                    </GlassCard>
                ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Calendario Semanal</h2>
            <CalendarView />
        </div>
    );
}
