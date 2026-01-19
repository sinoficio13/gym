'use client';

import { useState, useEffect } from 'react';
import { Users, Calendar } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarView } from "@/components/admin/CalendarView";

import { SubscriptionsManager } from "@/components/admin/SubscriptionsManager";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ activeMembers: 0, appointmentsToday: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();

            // 1. Active Members
            const { count: activeCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('subscription_status', 'activo');

            // 2. Appointments Today
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const { count: apptCount } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString())
                .neq('status', 'cancelled')
                .neq('status', 'cancelada');

            setStats({
                activeMembers: activeCount || 0,
                appointmentsToday: apptCount || 0
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Panel Admin</h1>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}</div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '16px'
            }}>
                {/* Card 1: Miembros Activos */}
                <GlassCard style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', marginBottom: '4px' }}>Miembros Activos</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} color="white" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                            {loading ? '-' : stats.activeMembers}
                        </span>
                    </div>
                </GlassCard>

                {/* Card 2: Citas Hoy */}
                <GlassCard style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: '#aaa', textTransform: 'uppercase', marginBottom: '4px' }}>Citas Hoy</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="white" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                            {loading ? '-' : stats.appointmentsToday}
                        </span>
                    </div>
                </GlassCard>
            </div>

            <SubscriptionsManager />

            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Calendario de Citas</h2>
            <CalendarView />
        </div>
    );
};
