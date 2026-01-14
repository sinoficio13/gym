'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './CalendarView.module.css';
import { createClient } from '@/lib/supabase/client';
import { AppointmentModal } from './AppointmentModal';

import { toast } from 'sonner';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 to 21:00

// 1. Define Solid Colors for Borders (Accents)
const GOAL_ACCENTS: Record<string, string> = {
    'Pérdida de Peso / Grasa': '#22c55e',      // Green 500
    'Pérdida de Peso': '#22c55e',
    'Ganar Masa Muscular (Hipertrofia)': '#ef4444',      // Red 500
    'Ganancia Muscular': '#ef4444',
    'Resistencia': '#3b82f6',        // Blue 500 (Legacy/Simpler)
    'Rendimiento Deportivo': '#3b82f6', // Blue 500
    'Definición / Tonificación': '#a855f7',      // Purple 500
    'Salud General y Bienestar': '#f59e0b',   // Amber 500
    'Ganar Fuerza Pura': '#ec4899', // Pink 500?
    'Rehabilitación / Prevención de Lesiones': '#14b8a6', // Teal 500
    'Flexibilidad': '#a855f7',
    'default': '#6b7280'           // Gray 500
};

// 2. Define Tinted Backgrounds (Low Opacity)
const GOAL_BACKGROUNDS: Record<string, string> = {
    'Pérdida de Peso / Grasa': 'rgba(34, 197, 94, 0.15)',
    'Pérdida de Peso': 'rgba(34, 197, 94, 0.15)',
    'Ganar Masa Muscular (Hipertrofia)': 'rgba(239, 68, 68, 0.15)',
    'Ganancia Muscular': 'rgba(239, 68, 68, 0.15)',
    'Resistencia': 'rgba(59, 130, 246, 0.15)',
    'Rendimiento Deportivo': 'rgba(59, 130, 246, 0.15)',
    'Definición / Tonificación': 'rgba(168, 85, 247, 0.15)',
    'Salud General y Bienestar': 'rgba(245, 158, 11, 0.15)',
    'Ganar Fuerza Pura': 'rgba(236, 72, 153, 0.15)',
    'Rehabilitación / Prevención de Lesiones': 'rgba(20, 184, 166, 0.15)',
    'Flexibilidad': 'rgba(168, 85, 247, 0.15)',
    'default': 'rgba(107, 114, 128, 0.15)'
};

interface CalendarViewProps {
    onStatsUpdate?: (stats: { today: number, week: number, clients: number }) => void;
}

export const CalendarView = ({ onStatsUpdate }: CalendarViewProps) => {
    // ... (existing state)
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'week' | 'day' | 'agenda'>('agenda'); // Default to agenda for Mobile
    const [appointments, setAppointments] = useState<any[]>([]);
    const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    useEffect(() => {
        // Auto-detect mobile and set agenda view
        if (window.innerWidth < 768) {
            setView('agenda');
        } else {
            setView('week');
        }
    }, []);

    const getRange = (date: Date) => {
        const start = new Date(date);
        const end = new Date(date);

        if (view === 'week') {
            const day = start.getDay();
            // Start from Sunday
            start.setDate(start.getDate() - day);
            start.setHours(0, 0, 0, 0);

            end.setDate(start.getDate() + 6); // End Saturday
            end.setHours(23, 59, 59, 999);
        } else {
            // Day view & Agenda view
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        return { start, end };
    };

    const loadAppointments = async () => {
        const supabase = createClient();
        const { start, end } = getRange(currentDate);

        // Fetch Appointments
        const { data: appData, error: appError } = await supabase
            .from('appointments')
            .select('*, profiles(full_name, phone, email, training_goal, birth_date, avatar_url)')
            .gte('start_time', start.toISOString())
            .lte('start_time', end.toISOString())
            .order('start_time', { ascending: true }); // Important for Agenda

        // Fetch Blocked Slots
        const { data: blockData, error: blockError } = await supabase
            .from('blocked_slots')
            .select('*')
            .gte('start_time', start.toISOString())
            .lte('start_time', end.toISOString());

        if (appData) {
            setAppointments(appData);
            if (onStatsUpdate) {
                const now = new Date();
                const todayStr = now.toDateString();
                const todayCount = appData.filter(a => new Date(a.start_time).toDateString() === todayStr).length;
                const visibleCount = appData.length;
                const uniqueClients = new Set(appData.map(a => a.user_id || a.profiles?.email)).size;

                onStatsUpdate({
                    today: todayCount,
                    week: visibleCount,
                    clients: uniqueClients
                });
            }
        } else {
            setAppointments([]);
            if (appError) {
                console.error('Error fetching appointments:', appError);
                toast.error('Error cargando citas.');
            }
            if (onStatsUpdate) onStatsUpdate({ today: 0, week: 0, clients: 0 });
        }

        // Merge fetched blocked slots with any existing optimistic (temp-) blocked slots
        const existingTempBlocks = blockedSlots.filter(b => String(b.id).startsWith('temp-'));
        if (blockData) {
            // Filter out any fetched blocks that might correspond to existing temp blocks (if real ID came back)
            const filteredBlockData = blockData.filter(dbBlock =>
                !existingTempBlocks.some(tempBlock =>
                    new Date(tempBlock.start_time).getTime() === new Date(dbBlock.start_time).getTime()
                )
            );
            setBlockedSlots([...filteredBlockData, ...existingTempBlocks]);
        } else {
            // If no new data, just keep the existing temp blocks
            setBlockedSlots(existingTempBlocks);
        }

        setLoading(false);
    };

    // Initial Load & Real-time Subscription
    useEffect(() => {
        loadAppointments();

        const supabase = createClient();

        // Appointments Subscription
        const appChannel = supabase
            .channel('public:appointments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
                console.log('Real-time update (appointments):', payload);
                loadAppointments();
            })
            .subscribe();

        // Blocked Slots Subscription
        const blockChannel = supabase
            .channel('public:blocked_slots')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'blocked_slots' }, (payload) => {
                console.log('Real-time update (blocked_slots):', payload);
                loadAppointments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(appChannel);
            supabase.removeChannel(blockChannel);
        };
    }, [currentDate, view]);

    // Memoize blocked slots for O(1) lookup
    const blockedSlotsSet = useMemo(() => {
        const set = new Set<string>();
        blockedSlots.forEach(b => {
            const date = new Date(b.start_time);
            // Multi-timezone safety: stick to local components as used in grid
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
            set.add(key);
        });
        return set;
    }, [blockedSlots]);

    // ... (navigate function)
    const navigate = (offset: number) => {
        const newDate = new Date(currentDate);
        if (view === 'week') {
            newDate.setDate(newDate.getDate() + (offset * 7));
        } else {
            newDate.setDate(newDate.getDate() + offset);
        }
        setCurrentDate(newDate);
    };

    const handleSlotClick = async (date: Date, hour: number) => {
        const slotTime = new Date(date);
        slotTime.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);

        // Find the specific blocked slot, including optimistic ones
        const isBlocked = blockedSlots.find(b => {
            const bStart = new Date(b.start_time);
            return bStart.getFullYear() === slotTime.getFullYear() &&
                bStart.getMonth() === slotTime.getMonth() &&
                bStart.getDate() === slotTime.getDate() &&
                bStart.getHours() === slotTime.getHours();
        });

        // If it's an optimistically added block that hasn't been confirmed by DB yet, prevent interaction
        if (isBlocked && String(isBlocked.id).startsWith('temp-')) {
            toast.info('Por favor, espera a que se confirme el bloqueo/desbloqueo anterior.');
            return;
        }

        const supabase = createClient();

        if (isBlocked) {
            // Unblock immediately (Optimistic)
            const previousBlocks = [...blockedSlots];
            setBlockedSlots(prev => prev.filter(b => b.id !== isBlocked.id));

            toast.promise(
                (async () => {
                    const { error } = await supabase.from('blocked_slots').delete().eq('id', isBlocked.id);
                    if (error) throw error;
                })(),
                {
                    loading: 'Desbloqueando...',
                    success: 'Horario desbloqueado',
                    error: () => {
                        setBlockedSlots(previousBlocks);
                        return 'Error al desbloquear';
                    }
                }
            );
        } else {
            // Block immediately (Optimistic)
            const endTime = new Date(slotTime);
            endTime.setHours(endTime.getHours() + 1);

            // Optimistic update
            const tempId = 'temp-' + Date.now();
            const newBlock = {
                id: tempId,
                start_time: slotTime.toISOString(),
                end_time: endTime.toISOString(),
                reason: 'Admin Block'
            };

            const previousBlocks = [...blockedSlots];
            setBlockedSlots(prev => [...prev, newBlock]);

            toast.promise(
                (async () => {
                    const { data, error } = await supabase.from('blocked_slots').insert({
                        start_time: slotTime.toISOString(),
                        end_time: endTime.toISOString(),
                        reason: 'Admin Block'
                    }).select().single();

                    if (error) throw error;

                    // Replace temp ID with real ID in state immediately
                    setBlockedSlots(prev => prev.map(b => b.id === tempId ? data : b));
                })(),
                {
                    loading: 'Bloqueando...',
                    success: 'Horario bloqueado',
                    error: () => {
                        setBlockedSlots(previousBlocks);
                        return 'Error al bloquear';
                    }
                }
            );
        }
    };

    // ... (days calculation)
    const days = [];
    const { start } = getRange(currentDate);
    const daysToShow = view === 'week' ? 7 : 1;

    for (let i = 0; i < daysToShow; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d);
    }

    // ... (rest of helper functions)
    const getAppointmentStyle = (startTime: string, endTime: string) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const startHour = start.getHours() + (start.getMinutes() / 60);
        const endHour = end.getHours() + (end.getMinutes() / 60);
        const top = (startHour - 6) * 60;
        const height = (endHour - startHour) * 60;
        return { top: `${top}px`, height: `${height}px` };
    };

    const formatHour = (hour: number) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const h = hour % 12 || 12;
        return `${h}:00 ${period}`;
    };

    const getGoalKey = (goal: string | undefined) => {
        if (!goal) return 'default';
        if (GOAL_ACCENTS[goal]) return goal;
        if (goal === 'weight_loss') return 'Pérdida de Peso / Grasa';
        if (goal === 'muscle_gain' || goal === 'hypertrophy') return 'Ganar Masa Muscular (Hipertrofia)';
        return 'default';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerControls}>
                    <button onClick={() => navigate(-1)} className={styles.navButton}>&larr;</button>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', textTransform: 'capitalize', textAlign: 'center', minWidth: '150px' }}>
                        {view === 'week'
                            ? start.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                            : currentDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })
                        }
                    </div>
                    <button onClick={() => navigate(1)} className={styles.navButton}>&rarr;</button>
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '8px', marginTop: '10px' }}>
                    <button
                        onClick={() => setView('agenda')}
                        className={styles.viewButton}
                        style={{
                            background: view === 'agenda' ? 'var(--md-sys-color-primary)' : 'transparent',
                            color: view === 'agenda' ? 'white' : 'inherit',
                            border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.8rem'
                        }}
                    >
                        Agenda
                    </button>
                    <button
                        onClick={() => setView('day')}
                        className={styles.viewButton}
                        style={{
                            background: view === 'day' ? 'var(--md-sys-color-primary)' : 'transparent',
                            color: view === 'day' ? 'white' : 'inherit',
                            border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.8rem'
                        }}
                    >
                        Día
                    </button>
                    <button
                        onClick={() => setView('week')}
                        className={styles.viewButton}
                        style={{
                            background: view === 'week' ? 'var(--md-sys-color-primary)' : 'transparent',
                            color: view === 'week' ? 'white' : 'inherit',
                            border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '0.8rem'
                        }}
                    >
                        Semana
                    </button>
                </div>
            </div>

            {view === 'agenda' ? (
                <div className={styles.agendaView}>
                    {appointments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div style={{ fontSize: '3rem' }}>📅</div>
                            <p>No hay citas programadas para este día.</p>
                        </div>
                    ) : (
                        appointments.map(apt => {
                            const rawGoal = apt.profiles?.training_goal;
                            const goalKey = getGoalKey(rawGoal);
                            const accentColor = GOAL_ACCENTS[goalKey] || GOAL_ACCENTS['default'];
                            const clientName = apt.profiles?.full_name || 'Desconocido';
                            const startTime = new Date(apt.start_time);

                            return (
                                <div
                                    key={apt.id}
                                    className={styles.agendaItem}
                                    style={{ borderLeft: `4px solid ${accentColor}` }}
                                    onClick={() => setSelectedAppointment(apt)}
                                >
                                    <div className={styles.agendaTime}>
                                        <span className={styles.agendaHour}>
                                            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}
                                        </span>
                                        <span className={styles.agendaPeriod}>
                                            {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[1]}
                                        </span>
                                    </div>
                                    <div className={styles.agendaDetails}>
                                        <div className={styles.agendaTitle}>{clientName}</div>
                                        <div className={styles.agendaSubtitle}>
                                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor }} />
                                            {rawGoal || 'Sin Objetivo'}
                                        </div>
                                    </div>
                                    <div style={{ alignSelf: 'center', opacity: 0.5 }}>&gt;</div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className={styles.grid} style={{ gridTemplateColumns: `60px repeat(${daysToShow}, 1fr)` }}>
                    {/* Time Column */}
                    <div className={styles.timeColumn}>
                        <div className={styles.dayHeader} style={{ borderBottom: 'none', visibility: 'hidden' }}>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>
                        </div>
                        {HOURS.map(h => (
                            <div key={h} className={styles.timeLabel}>
                                {formatHour(h)}
                            </div>
                        ))}
                    </div>

                    {/* Days Columns */}
                    {days.map((day, i) => (
                        <div key={i} className={styles.dayColumn}>
                            {/* Day Header */}
                            <div className={`${styles.dayHeader} ${day.toDateString() === new Date().toDateString() ? styles.currentDayHeader : ''}`}>
                                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{day.toLocaleDateString('es-ES', { weekday: view === 'day' ? 'long' : 'short' })}</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{day.getDate()}</div>
                            </div>

                            <div className={styles.gridContent}>
                                {/* Grid Lines & Slots */}
                                {HOURS.map(h => {
                                    // O(1) Lookup
                                    const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}-${h}`;
                                    const isBlocked = blockedSlotsSet.has(key);

                                    // Check if this specific blocked slot is an optimistic (temp-) one
                                    const currentBlockedSlot = blockedSlots.find(b => {
                                        const bStart = new Date(b.start_time);
                                        return bStart.getFullYear() === day.getFullYear() &&
                                            bStart.getMonth() === day.getMonth() &&
                                            bStart.getDate() === day.getDate() &&
                                            bStart.getHours() === h;
                                    });
                                    const isTempBlocked = isBlocked && String(currentBlockedSlot?.id).startsWith('temp-');

                                    return (
                                        <div
                                            key={h}
                                            className={styles.hourCell}
                                            style={{
                                                backgroundColor: isBlocked ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                                backgroundImage: isBlocked ? 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)' : 'none',
                                                cursor: isTempBlocked ? 'wait' : 'pointer',
                                                opacity: isTempBlocked ? 0.5 : 1,
                                            }}
                                            onClick={isTempBlocked ? undefined : () => handleSlotClick(day, h)}
                                        >
                                            {isBlocked && (
                                                <div style={{ fontSize: '0.7rem', color: '#aaa', padding: '4px' }}>🔒</div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Appointments */}
                                {appointments
                                    .filter(apt => new Date(apt.start_time).getDate() === day.getDate())
                                    .map(apt => {
                                        const rawGoal = apt.profiles?.training_goal;
                                        const goalKey = getGoalKey(rawGoal);
                                        const accentColor = GOAL_ACCENTS[goalKey] || GOAL_ACCENTS['default'];
                                        const bgColor = GOAL_BACKGROUNDS[goalKey] || GOAL_BACKGROUNDS['default'];

                                        return (
                                            <div
                                                key={apt.id}
                                                className={styles.appointment}
                                                style={{
                                                    ...getAppointmentStyle(apt.start_time, apt.end_time),
                                                    background: bgColor,
                                                    borderLeft: `4px solid ${accentColor}`,
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
                                                    zIndex: 10,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    gap: '2px',
                                                    overflow: 'hidden'
                                                }}
                                                onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                                            >
                                                <div style={{ fontWeight: '700', fontSize: '0.75rem', color: '#fff', lineHeight: '1.1' }}>
                                                    {new Date(apt.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                                </div>
                                                <div style={{ fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff', lineHeight: '1.2' }}>
                                                    {apt.profiles?.full_name || 'Desconocido'}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>
                                                    {apt.profiles?.training_goal || ''}
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedAppointment && (
                <AppointmentModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onUpdate={() => {
                        loadAppointments();
                        setSelectedAppointment(null);
                    }}
                />
            )}
        </div>
    );
};
