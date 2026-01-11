'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import Link from 'next/link';
import styles from './ClientDashboard.module.css';

export default function ClientDashboardHome() {
    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.title}>Hola, Jose 👋</h1>
                <p className={styles.subtitle}>Aquí tienes el resumen de tu rendimiento. ¡Vamos a por más!</p>
            </div>

            {/* Quick Actions Grid */}
            <div className={styles.grid}>

                {/* Status Card */}
                <div className={styles.cardContainer}>
                    <GlassCard>
                        <h3 className={styles.cardTitle}>Próxima Sesión</h3>
                        <div className={styles.cardContent}>
                            <p className={styles.emptyStateText}>No tienes citas programadas.</p>
                        </div>
                        <Link href="/dashboard/client/booking">
                            <PrimaryButton fullWidth>Agendar Ahora</PrimaryButton>
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
                                <div className={styles.statLabel}>Peso Actual</div>
                                <div className={styles.statValue}>-- kg</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statLabel}>Cambio</div>
                                <div className={styles.statValue} style={{ color: '#81c784' }}>--</div>
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

                {/* Quick Info / Tips Card (New for Desktop Balance) */}
                <div className={styles.cardContainer}>
                    <GlassCard>
                        <h3 className={styles.cardTitle}>Plan Actual</h3>
                        <div style={{ padding: '1rem', background: 'rgba(103, 80, 164, 0.1)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(103, 80, 164, 0.2)' }}>
                            <p style={{ color: '#d0bcff', fontWeight: 'bold' }}>Suscripción Mensual</p>
                            <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Vence el: 20 Oct 2026</p>
                        </div>
                        <button className={styles.actionButton} style={{ marginTop: 'auto' }}>
                            Gestionar Suscripción
                        </button>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
}
