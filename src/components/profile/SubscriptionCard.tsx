'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface SubscriptionCardProps {
    profileId: string;
    subscriptionStatus: string; // 'active', 'inactive', 'pending', etc.
    subscriptionPlan?: string;
    subscriptionExpiry?: string;
    onUpdate: () => void; // Callback to refresh parent data
}

export const SubscriptionCard = ({
    profileId,
    subscriptionStatus,
    subscriptionPlan,
    subscriptionExpiry,
    onUpdate
}: SubscriptionCardProps) => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [pendingRequest, setPendingRequest] = useState<any>(null);

    // Initial check for pending requests (if status is not active)
    useEffect(() => {
        const checkPending = async () => {
            if (subscriptionStatus === 'active') return;

            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', profileId)
                .eq('status', 'pending')
                .single();

            if (data) setPendingRequest(data);
        };

        checkPending();
    }, [profileId, subscriptionStatus]);

    const handleRequest = async (planType: 'semanal' | 'mensual') => {
        if (!confirm(`¿Confirmas que deseas solicitar un plan ${planType.toUpperCase()}?`)) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('subscriptions')
                .insert({
                    user_id: profileId,
                    plan_type: planType,
                    status: 'pendiente'
                });

            if (error) throw error;

            toast.success('Solicitud enviada correctamente. Espera la confirmación del administrador.');
            onUpdate(); // Refresh parent
            // Optimistic update for UI
            setPendingRequest({ plan_type: planType });

        } catch (error: any) {
            toast.error('Error al solicitar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('¿Cancelar la solicitud?')) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from('subscriptions')
                .delete()
                .eq('id', pendingRequest.id);

            if (error) throw error;
            toast.success('Solicitud cancelada.');
            setPendingRequest(null);
            onUpdate();
        } catch (error: any) {
            toast.error('Error al cancelar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Render logic based on status
    const isPending = !!pendingRequest;
    const isActive = subscriptionStatus === 'activo';

    return (
        <div style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px',
            marginTop: '20px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>Estado de Suscripción</h3>
                {isActive && (
                    <span style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#4ade80',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                        ACTIVO
                    </span>
                )}
                {isPending && (
                    <span style={{
                        background: 'rgba(234, 179, 8, 0.2)',
                        color: '#facc15',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(234, 179, 8, 0.3)'
                    }}>
                        EN REVISIÓN
                    </span>
                )}
                {!isActive && !isPending && (
                    <span style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#aaa',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        INACTIVO
                    </span>
                )}
            </div>

            {/* CONTENT BASED ON STATE */}

            {/* 1. ACTIVE STATE */}
            {isActive && (
                <div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '8px', textTransform: 'capitalize' }}>
                        Plan {subscriptionPlan}
                    </div>
                    <div style={{ color: '#aaa' }}>
                        Vence el: <strong style={{ color: 'white' }}>{subscriptionExpiry ? new Date(subscriptionExpiry).toLocaleDateString() : 'N/A'}</strong>
                    </div>
                </div>
            )}

            {/* 2. PENDING STATE */}
            {isPending && (
                <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(234, 179, 8, 0.05)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                    <h4 style={{ color: '#facc15', margin: '0 0 8px 0' }}>Solicitud Recibida</h4>
                    <p style={{ color: '#ccc', margin: 0, fontSize: '0.9rem', marginBottom: '16px' }}>
                        Tu solicitud para el <strong>Plan {pendingRequest?.plan_type}</strong> está siendo revisada por el administrador.
                    </p>
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#aaa',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                        }}
                    >
                        Cancelar Solicitud
                    </button>
                </div>
            )}

            {/* 3. INACTIVE / EXPIRED STATE (ACTIONS) */}
            {!isActive && !isPending && (
                <div>
                    <p style={{ color: '#ccc', marginBottom: '20px' }}>
                        No tienes una suscripción activa. Selecciona un plan para comenzar a agendar tus entrenamientos.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <button
                            disabled={loading}
                            onClick={() => handleRequest('semanal')}
                            style={{
                                padding: '16px',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                        >
                            <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', marginBottom: '4px' }}>Corto Plazo</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Plan Semanal</div>
                        </button>

                        <button
                            disabled={loading}
                            onClick={() => handleRequest('mensual')}
                            style={{
                                padding: '16px',
                                background: 'var(--md-sys-color-primary)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'var(--md-sys-color-on-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>Mejor Valor</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Plan Mensual</div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
