'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import Link from 'next/link';
import styles from './ClientDashboard.module.css';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ClientDashboardHome() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [nextAppointment, setNextAppointment] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // 1. Fetch Profile (Subscription)
                const { data: profileRect } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profileRect);

                // 2. Fetch Next Appointment
                const now = new Date().toISOString();
                const { data: appointments } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('start_time', now)
                    .order('start_time', { ascending: true })
                    .limit(1);

                if (appointments && appointments.length > 0) {
                    setNextAppointment(appointments[0]);
                }
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'No definido';
        return new Date(dateString).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.title}>Hola, {profile?.full_name?.split(' ')[0] || 'Atleta'} 👋</h1>
                <p className={styles.subtitle}>Aquí tienes el resumen de tu rendimiento. ¡Vamos a por más!</p>
            </div>

            {/* Quick Actions Grid */}
            <div className={styles.grid}>

                {/* Status Card - Next Appointment */}
                <div className={styles.cardContainer}>
                    <GlassCard>
                        <h3 className={styles.cardTitle}>Próxima Sesión</h3>
                        <div className={styles.cardContent}>
                            {nextAppointment ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                                        {formatDate(nextAppointment.start_time)}
                                    </div>
                                    <div style={{ fontSize: '1.2rem', color: '#d0bcff', marginTop: '4px' }}>
                                        {formatTime(nextAppointment.start_time)}
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.emptyStateText}>No tienes citas programadas.</p>
                            )}
                        </div>
                        <Link href="/dashboard/client/booking">
                            <PrimaryButton fullWidth>
                                {nextAppointment ? 'Gestionar Citas' : 'Agendar Ahora'}
                            </PrimaryButton>
                        </Link>
                    </GlassCard>
                </div>

                {/* Progress Summary Card */}
                <div className={styles.cardContainer}>
                    <GlassCard>
                        <div className={styles.cardTitle}>
                            <h3>Mi Progreso</h3>
                            <span className={styles.statusBadge}>Activo</span>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Meta</div>
                                <div className={styles.statValue} style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {profile?.training_goal || '--'}
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard/client/progress">
                            <button className={styles.actionButton}>
                                Ver Gráficas Completas
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                            </button>
                        </Link>
                    </GlassCard>
                </div>

                {/* Current Plan Card */}
                <div className={styles.cardContainer}>
                    <GlassCard
                        style={{
                            borderLeft: profile?.subscription_status === 'active'
                                ? '4px solid #22c55e'
                                : '4px solid #ef4444'
                        }}
                    >
                        <h3 className={styles.cardTitle}>Plan Actual</h3>
                        <div style={{
                            padding: '1rem',
                            background: profile?.subscription_status === 'active'
                                ? 'rgba(34, 197, 94, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    {profile?.subscription_plan === 'Free' ? 'Sin Plan' : profile?.subscription_plan}
                                </p>
                                {profile?.subscription_status === 'active' ? (
                                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: '#22c55e', color: 'black', fontWeight: 'bold' }}>Activo</span>
                                ) : (
                                    <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '12px', background: '#ef4444', color: 'white', fontWeight: 'bold' }}>
                                        {profile?.subscription_status === 'pending' ? 'Pago Pendiente' : 'Vencido'}
                                    </span>
                                )}
                            </div>

                            {profile?.subscription_status !== 'active' && (
                                <p style={{ fontSize: '0.9rem', color: '#ffaaaa', marginTop: '10px', lineHeight: '1.4' }}>
                                    ⚠️ Tu suscripción requiere atención. Por favor contacta al administrador para regularizar tu pago.
                                </p>
                            )}

                            {profile?.subscription_expiry && (
                                <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '10px' }}>
                                    Vence el: {formatDate(profile.subscription_expiry)}
                                </p>
                            )}
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
}
