'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { formatTime12h } from '@/lib/utils';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function AdminSchedulePage() {
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingDay, setAddingDay] = useState<number | null>(null);
    const [newTime, setNewTime] = useState('08:00');

    const supabase = createClient();

    const fetchSchedule = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('work_schedule')
            .select('*')
            .order('day_of_week')
            .order('start_time');

        if (error) {
            toast.error('Error cargando horario');
        } else {
            setSchedule(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const handleAddSlot = async (dayIndex: number) => {
        if (!newTime) return;

        // Check duplicate
        const exists = schedule.some(s => s.day_of_week === dayIndex && s.start_time.startsWith(newTime));
        if (exists) {
            toast.warning('Esa hora ya existe para este día.');
            return;
        }

        const { error } = await supabase.from('work_schedule').insert({
            day_of_week: dayIndex,
            start_time: newTime,
            is_active: true
        });

        if (error) {
            toast.error('Error al agregar hora');
        } else {
            toast.success('Hora agregada');
            setAddingDay(null);
            fetchSchedule();
        }
    };

    const handleDeleteSlot = async (id: string) => {
        const { error } = await supabase.from('work_schedule').delete().eq('id', id);
        if (error) {
            toast.error('Error al eliminar');
        } else {
            fetchSchedule();
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px', color: 'white' }}>Configuración de Horario</h1>
            <p style={{ color: '#aaa', marginBottom: '30px' }}>
                Define las horas exactas que aparecerán disponibles para que los clientes reserven.
                Los clientes verán estas horas en formato 12H (AM/PM).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {DAYS.map((dayName, index) => {
                    const daySlots = schedule.filter(s => s.day_of_week === index);

                    return (
                        <GlassCard key={index} className="p-4" style={{ minHeight: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--md-sys-color-primary)' }}>{dayName}</h3>
                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{daySlots.length} horas</span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                                {daySlots.map(slot => (
                                    <div key={slot.id} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '5px 10px',
                                        borderRadius: '6px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <span style={{ fontWeight: '500' }}>{formatTime12h(slot.start_time)}</span>
                                        <button
                                            onClick={() => handleDeleteSlot(slot.id)}
                                            style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                {daySlots.length === 0 && (
                                    <div style={{ color: '#666', fontSize: '0.9rem', width: '100%', textAlign: 'center', padding: '20px 0' }}>
                                        No hay horas configuradas
                                    </div>
                                )}
                            </div>

                            {addingDay === index ? (
                                <div style={{ display: 'flex', gap: '5px', marginTop: 'auto' }}>
                                    <input
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        style={{
                                            background: '#1e1e1e',
                                            border: '1px solid #333',
                                            color: 'white',
                                            padding: '5px',
                                            borderRadius: '4px',
                                            flex: 1
                                        }}
                                    />
                                    <button
                                        onClick={() => handleAddSlot(index)}
                                        style={{ background: '#22c55e', border: 'none', borderRadius: '4px', padding: '0 10px', color: 'white', cursor: 'pointer' }}
                                    >
                                        ✓
                                    </button>
                                    <button
                                        onClick={() => setAddingDay(null)}
                                        style={{ background: '#ef4444', border: 'none', borderRadius: '4px', padding: '0 10px', color: 'white', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <PrimaryButton
                                    fullWidth
                                    onClick={() => { setAddingDay(index); setNewTime('08:00'); }}
                                    style={{ marginTop: 'auto', fontSize: '0.9rem', padding: '8px' }}
                                >
                                    + Agregar Hora
                                </PrimaryButton>
                            )}
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}
