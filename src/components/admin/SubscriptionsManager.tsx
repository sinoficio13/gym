'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { toast } from 'sonner';

import styles from './SubscriptionsManager.module.css';
import { Check, X, AlertTriangle } from 'lucide-react';

export const SubscriptionsManager = () => {
    const supabase = createClient();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject';
        request: any;
        message: React.ReactNode;
    } | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*, profiles(full_name, email, phone, avatar_url)')
            .eq('status', 'pendiente')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching subscriptions:', error);
        } else {
            setRequests(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();

        const channel = supabase
            .channel('admin-subs')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions' }, () => {
                fetchRequests();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleApproveClick = (req: any) => {
        const endDate = new Date();
        if (req.plan_type === 'semanal') endDate.setDate(endDate.getDate() + 7);
        else endDate.setMonth(endDate.getMonth() + 1);

        setModal({
            isOpen: true,
            type: 'approve',
            request: req,
            message: (
                <>
                    ¿Aprobar plan <strong>{req.plan_type.toUpperCase()}</strong> para <br />
                    <span style={{ color: 'white' }}>{req.profiles?.email}</span>?
                    <div style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.7 }}>
                        Vence: {endDate.toLocaleDateString()}
                    </div>
                </>
            )
        });
    };

    const handleRejectClick = (req: any) => {
        setModal({
            isOpen: true,
            type: 'reject',
            request: req,
            message: `¿Rechazar solicitud de ${req.profiles?.full_name}?`
        });
    };

    const executeAction = async () => {
        if (!modal) return;
        const { type, request: req } = modal;
        setProcessing(req.id);
        setModal(null); // Close modal immediately

        if (type === 'approve') {
            const startDate = new Date();
            const endDate = new Date();

            if (req.plan_type === 'semanal') {
                endDate.setDate(endDate.getDate() + 7);
            } else {
                endDate.setMonth(endDate.getMonth() + 1);
            }

            const { error } = await supabase
                .from('subscriptions')
                .update({
                    status: 'activo',
                    start_date: startDate.toISOString(),
                    end_date: endDate.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', req.id);

            if (error) {
                toast.error('Error al aprobar: ' + error.message);
            } else {
                toast.success('Suscripción aprobada y activada');
                setRequests(prev => prev.filter(r => r.id !== req.id));
            }
        } else {
            // Reject
            const { error } = await supabase
                .from('subscriptions')
                .update({
                    status: 'rechazado',
                    updated_at: new Date().toISOString()
                })
                .eq('id', req.id);

            if (error) {
                toast.error('Error al rechazar: ' + error.message);
            } else {
                toast.success('Solicitud rechazada');
                setRequests(prev => prev.filter(r => r.id !== req.id));
            }
        }
        setProcessing(null);
    };

    if (loading && requests.length === 0) return <div style={{ color: '#aaa', padding: '20px' }}>Cargando solicitudes...</div>;

    // Auto-hide if no requests
    if (!loading && requests.length === 0) return null;

    return (
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Solicitudes de Suscripción
                <span style={{ background: '#eab308', color: 'black', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                    {requests.length}
                </span>
            </h2>

            {requests.length === 0 ? (
                <GlassCard style={{ padding: '32px', textAlign: 'center', color: '#666', borderStyle: 'dashed' }}>
                    <p style={{ margin: 0 }}>No hay solicitudes pendientes por revisar.</p>
                </GlassCard>
            ) : (
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {requests.map(req => (
                        <GlassCard key={req.id} style={{ borderLeft: '4px solid #eab308' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: 'white' }}>{req.profiles?.full_name || 'Usuario'}</h4>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>{req.profiles?.email}</p>
                                </div>
                                <span style={{
                                    textTransform: 'capitalize',
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: '#ddd'
                                }}>
                                    {req.plan_type}
                                </span>
                            </div>

                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '16px' }}>
                                Solicitado: {new Date(req.created_at).toLocaleDateString()}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleApproveClick(req)}
                                    disabled={processing === req.id}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: '#22c55e',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Aprobar
                                </button>
                                <button
                                    onClick={() => handleRejectClick(req)}
                                    disabled={processing === req.id}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: '1px solid #ef4444',
                                        background: 'transparent',
                                        color: '#ef4444',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Rechazar
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* Custom Modal */}
            {modal && (
                <div className={styles.modalOverlay} onClick={() => setModal(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={`${styles.iconWrapper} ${modal.type === 'approve' ? styles.iconApprove : styles.iconReject}`}>
                            {modal.type === 'approve' ? <Check size={40} /> : <X size={40} />}
                        </div>

                        <h3 className={styles.modalTitle}>
                            {modal.type === 'approve' ? 'Confirmar Aprobación' : 'Rechazar Solicitud'}
                        </h3>
                        <div className={styles.modalText}>
                            {modal.message}
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.btnCancel}
                                onClick={() => setModal(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className={`${styles.btnConfirm} ${modal.type === 'approve' ? styles.btnApprove : styles.btnReject}`}
                                onClick={executeAction}
                            >
                                {modal.type === 'approve' ? 'Sí, Aprobar' : 'Sí, Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
