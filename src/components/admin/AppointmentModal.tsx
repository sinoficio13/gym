'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface AppointmentModalProps {
    appointment: any;
    onClose: () => void;
    onUpdate: () => void;
}

export const AppointmentModal = ({ appointment, onClose, onUpdate }: AppointmentModalProps) => {
    const supabase = createClient();

    // States
    const [status, setStatus] = useState(appointment.status);
    const [loading, setLoading] = useState(false);

    // Date/Time editing states
    // Handle potential nulls or invalid dates safely, though appointment should have them
    const safeDate = new Date(appointment.start_time);
    const [date, setDate] = useState(safeDate.toISOString().split('T')[0]);

    // Helper to get HH:mm in 24h format for input type="time"
    const get24hTime = (d: Date) => {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const [time, setTime] = useState(get24hTime(safeDate));

    const handleSave = async () => {
        setLoading(true);

        try {
            const newStart = new Date(`${date}T${time}:00`);
            const oldStart = new Date(appointment.start_time);
            const oldEnd = new Date(appointment.end_time);
            const durationMs = oldEnd.getTime() - oldStart.getTime();
            const finalEnd = new Date(newStart.getTime() + durationMs);

            // 1. VALIDATION: Check Capacity & User Duplication
            // Fetch ALL appointments starting at this Exact Time
            const { data: conflicts, error: conflictError } = await supabase
                .from('appointments')
                .select('id, user_id, status')
                .eq('start_time', newStart.toISOString())
                .neq('status', 'cancelled'); // Don't count cancelled

            if (conflictError) throw conflictError;

            const existingApps = conflicts || [];

            // Check Capacity (Max 3)
            // Filter out CURRENT appointment if it's already in this slot (editing same time)
            const otherApps = existingApps.filter(a => a.id !== appointment.id);
            if (otherApps.length >= 3) {
                alert('🚫 ACUPADO: Ya hay 3 personas agendadas a esta hora. Selecciona otro horario.');
                setLoading(false);
                return;
            }

            // Check User Duplication
            const userAlreadyHasAppt = otherApps.some(a => a.user_id === appointment.user_id);
            if (userAlreadyHasAppt) {
                alert('⚠️ DUPLICADO: Este usuario ya tiene una cita agendada a esta hora.');
                setLoading(false);
                return;
            }

            // 2. Perform Update if Valid
            const { error } = await supabase
                .from('appointments')
                .update({
                    status,
                    start_time: newStart.toISOString(),
                    end_time: finalEnd.toISOString()
                })
                .eq('id', appointment.id);

            if (error) throw error;

            onUpdate();
            onClose();
        } catch (error: any) {
            alert('Error al actualizar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás segura de eliminar esta cita? Esta acción no se puede deshacer.')) return;

        setLoading(true);
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointment.id);

        setLoading(false);
        if (!error) {
            onUpdate();
            onClose();
        } else {
            alert('Error al eliminar: ' + error.message);
        }
    };

    // Removed GOAL_TRANSLATIONS as data is now native Spanish

    const client = appointment.profiles || {};

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center', // Center vertically on desktop
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
            overflowY: 'auto' // Allow scrolling for the whole overlay if content is tall
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '100%',
                maxWidth: '500px',
                // Mobile improvements:
                margin: 'auto', // Centering trick for flex + scroll
                maxHeight: '100%' // Prevent sticking out
            }}>
                <GlassCard style={{ background: 'var(--premium-gradient-surface)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Detalles de la Cita</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                    </div>

                    {/* Info Cliente */}
                    <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#d0bcff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Cliente</h3>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', overflow: 'hidden' }}>
                                {client.avatar_url ? (
                                    <img src={client.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    client.full_name?.[0] || 'U'
                                )}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{client.full_name || 'Sin Nombre'}</div>
                                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{client.email}</div>
                                {client.phone && (
                                    <a
                                        href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#4ade80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', textDecoration: 'none' }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                        Chat WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>
                        {client.training_goal && (
                            <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#ccc' }}>
                                <strong style={{ color: '#aaa' }}>Objetivo:</strong> {client.training_goal}
                            </div>
                        )}
                    </div>

                    {/* Editor de Sesión */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#d0bcff', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Editar Sesión</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Fecha</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Hora (Inicio)</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Estado</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        fontFamily: 'inherit'
                                    }}
                                >
                                    <option value="pending">🟡 Pendiente</option>
                                    <option value="confirmed">🟢 Confirmada</option>
                                    <option value="cancelled">🔴 Cancelada</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <PrimaryButton onClick={handleSave} disabled={loading} fullWidth>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </PrimaryButton>
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'rgba(255, 59, 48, 0.1)',
                                color: '#ff453a',
                                border: '1px solid rgba(255,59,48,0.2)',
                                borderRadius: '100px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
