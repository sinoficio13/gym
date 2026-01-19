'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { toast } from 'sonner';

export const SubscriptionsManager = () => {
    const supabase = createClient();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*, profiles(full_name, email, phone, avatar_url)')
            .eq('status', 'pending')
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

        // Realtime subscription for new requests
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

    const handleApprove = async (req: any) => {
        const startDate = new Date();
        const endDate = new Date();

        // Set default duration based on plan
        if (req.plan_type === 'semanal') {
            endDate.setDate(endDate.getDate() + 7);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Prompt for confirmation (simple for now, could be a modal later)
        if (!confirm(`¿Aprobar plan ${req.plan_type.toUpperCase()} para ${req.profiles?.email}?\n\nVence: ${endDate.toLocaleDateString()}`)) return;

        setProcessing(req.id);

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
            // List will auto-refresh via realtime or we can filter locally
            setRequests(prev => prev.filter(r => r.id !== req.id));
        }
        setProcessing(null);
    };

    const handleReject = async (req: any) => {
        if (!confirm('¿Rechazar esta solicitud?')) return;
        setProcessing(req.id);

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
        setProcessing(null);
    };

    if (loading && requests.length === 0) return <div style={{ color: '#aaa', padding: '20px' }}>Cargando solicitudes...</div>;
    // Removed early return to keep section visible

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
                            {/* ... Content ... */}
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
                                    onClick={() => handleApprove(req)}
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
                                    onClick={() => handleReject(req)}
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
        </div>
    );
};
