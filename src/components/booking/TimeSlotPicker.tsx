'use client';

import React, { useState, useEffect } from 'react';
import { PrimaryButton } from '../ui/PrimaryButton';
import styles from './TimeSlotPicker.module.css';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatTime12h } from '@/lib/utils';

const DAYS_MAP = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const TimeSlotPicker = () => {
    const supabase = createClient();
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);

    // Slots that are physically impossible to book (full or admin blocked)
    const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
    // Map of time -> appointmentId for the current user
    const [myAppointments, setMyAppointments] = useState<Record<string, string>>({});

    // State for custom confirmation modal
    const [apptToCancel, setApptToCancel] = useState<string | null>(null);

    const [loadingSlots, setLoadingSlots] = useState(false);
    const [booking, setBooking] = useState(false);

    // Generate next 7 days
    const [weekDays, setWeekDays] = useState<Date[]>([]);

    useEffect(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push(d);
        }
        setWeekDays(days);
        setSelectedDate(days[0]); // Select today by default
    }, []);

    // Fetch unavailable slots when date changes
    useEffect(() => {
        if (!selectedDate) return;

        async function fetchSlots() {
            setLoadingSlots(true);
            const { data: { user } } = await supabase.auth.getUser();

            // Start of day
            const startOfDay = new Date(selectedDate!);
            startOfDay.setHours(0, 0, 0, 0);

            // End of day
            const endOfDay = new Date(selectedDate!);
            endOfDay.setHours(23, 59, 59, 999);

            // 1. Fetch Dynamic Schedule for this Day of Week
            const dayOfWeek = selectedDate!.getDay(); // 0-6
            const { data: scheduleData } = await supabase
                .from('work_schedule')
                .select('start_time')
                .eq('day_of_week', dayOfWeek)
                .eq('is_active', true)
                .order('start_time');

            // Fallback default hours if DB is empty
            const baseSlots = scheduleData && scheduleData.length > 0
                ? scheduleData.map(s => s.start_time.slice(0, 5))
                : Array.from({ length: 15 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

            setAvailableSlots(baseSlots);
            setSelectedTime(null); // Reset selection on date change

            // 2. Fetch Appointments
            const { data: aptData } = await supabase
                .from('appointments')
                .select('id, start_time, client_id')
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString())
                .neq('status', 'cancelled');

            // 3. Fetch Blocked Slots (Admin Overrides)
            const { data: blockData } = await supabase
                .from('blocked_slots')
                .select('start_time')
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString());

            // Process Availability
            const slotCounts: Record<string, number> = {};
            const adminBlockedSlots: string[] = [];
            const myApptsMap: Record<string, string> = {};

            if (aptData) {
                aptData.forEach(apt => {
                    const date = new Date(apt.start_time);
                    const timeKey = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    slotCounts[timeKey] = (slotCounts[timeKey] || 0) + 1;

                    if (user && apt.client_id === user.id) {
                        myApptsMap[timeKey] = apt.id;
                    }
                });
            }

            if (blockData) {
                blockData.forEach(block => {
                    const blockStart = new Date(block.start_time);
                    const timeKey = `${blockStart.getHours().toString().padStart(2, '0')}:${blockStart.getMinutes().toString().padStart(2, '0')}`;
                    adminBlockedSlots.push(timeKey);
                });
            }

            setMyAppointments(myApptsMap);

            // Mark Unavailable (Exclude user's own slots from 'unavailable' so they stay interactive)
            const blocked = baseSlots.filter(h => {
                const isFull = (slotCounts[h] || 0) >= 10; // Capacity limit
                // We do NOT block 'my bookings' here, we handle them in render as 'special' slots
                const isAdminBlocked = adminBlockedSlots.includes(h);
                return isFull || isAdminBlocked;
            });

            setUnavailableSlots(blocked);
            setLoadingSlots(false);
        }

        fetchSlots();
    }, [selectedDate, supabase]);

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime) return;
        setBooking(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Debes iniciar sesión para reservar.");
            router.push('/login');
            return;
        }

        // Check profile
        const { data: profile } = await supabase.from('profiles').select('id, full_name, subscription_status').eq('id', user.id).single();
        if (!profile || !profile.full_name) {
            toast.warning("Por favor completa tu perfil antes de reservar.");
            router.push('/dashboard/client/profile');
            return;
        }

        if (profile.subscription_status !== 'activo') {
            toast.error("Tu suscripción no está activa. Por favor renueva tu plan para agendar.");
            return;
        }

        // Construct timestamp
        const [hours, minutes] = selectedTime.split(':').map(Number);
        const startDate = new Date(selectedDate);
        startDate.setHours(hours, minutes, 0, 0);

        // Duration 1 hour default
        const endDate = new Date(startDate);
        endDate.setHours(hours + 1, minutes, 0, 0);

        const { error } = await supabase
            .from('appointments')
            .insert({
                client_id: user.id,
                start_time: startDate.toISOString(),
                end_time: endDate.toISOString(),
                status: 'confirmed'
            });

        setBooking(false);

        if (error) {
            toast.error('Error al reservar: ' + error.message);
        } else {
            toast.success('¡Reserva Exitosa! Nos vemos pronto.');
            // Force refresh of slots
            const current = selectedDate;
            setSelectedDate(null);
            setTimeout(() => setSelectedDate(current), 10);
        }
    };

    const handleCancelClick = (appointmentId: string) => {
        setApptToCancel(appointmentId);
    };

    const confirmCancel = async () => {
        if (!apptToCancel) return;

        setBooking(true);
        const { error } = await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', apptToCancel);

        setBooking(false);
        setApptToCancel(null);

        if (error) {
            toast.error('Error al cancelar: ' + error.message);
        } else {
            toast.success('Cita cancelada correctamente.');
            // Refresh
            const current = selectedDate;
            setSelectedDate(null);
            setTimeout(() => setSelectedDate(current), 10);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.sectionTitle}>1. Elige el día</h3>
            <div className={styles.daysGrid}>
                {weekDays.map((date, index) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    return (
                        <button
                            key={index}
                            className={`${styles.dayButton} ${isSelected ? styles.selectedDay : ''}`}
                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                        >
                            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                {DAYS_MAP[date.getDay()].substring(0, 3)}
                            </span>
                            <span className={styles.dateNumber}>{date.getDate()}</span>
                        </button>
                    )
                })}
            </div>

            <h3 className={styles.sectionTitle}>
                2. Elige la hora disponible
                {loadingSlots && <span className="text-xs ml-2 opacity-50">Cargando...</span>}
            </h3>

            <div className={styles.timesGrid}>
                {availableSlots.length === 0 && !loadingSlots ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#888' }}>
                        No hay horarios disponibles para este día.
                    </div>
                ) : (
                    availableSlots.map((time) => {
                        const myBookingId = myAppointments[time];
                        const isBlocked = unavailableSlots.includes(time);
                        // Disable if blocked AND not mine. If mine, enable for cancel.
                        const disabled = isBlocked && !myBookingId;
                        const isSelected = selectedTime === time;

                        return (
                            <button
                                key={time}
                                disabled={disabled}
                                className={`
                                    ${styles.timeButton} 
                                    ${isSelected ? styles.selectedTime : ''} 
                                    ${disabled ? styles.disabledButton : ''}
                                    ${myBookingId ? styles.myBooking : ''}
                                `}
                                onClick={() => {
                                    if (myBookingId) {
                                        handleCancelClick(myBookingId);
                                    } else if (!disabled) {
                                        setSelectedTime(time);
                                    }
                                }}
                            >
                                {formatTime12h(time)}
                                {myBookingId && <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 'bold' }}>
                                    Tu Reserva
                                </span>}
                                {disabled && !myBookingId && <span style={{ display: 'block', fontSize: '0.6rem', color: '#ff6b6b' }}>
                                    Ocupado
                                </span>}
                            </button>
                        )
                    })
                )}
            </div>

            <div className={styles.actionArea}>
                <PrimaryButton
                    fullWidth
                    disabled={!selectedTime || booking}
                    onClick={handleConfirm}
                    className={!selectedTime ? styles.disabledButton : ''}
                >
                    {booking ? 'Procesando...' : (selectedTime ? 'Confirmar Reserva' : 'Selecciona una hora')}
                </PrimaryButton>
            </div>

            {/* Premium Confirmation Modal */}
            {apptToCancel && (
                <div className={styles.modalOverlay} onClick={() => setApptToCancel(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.iconWrapper}>
                            {/* Trash Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>

                        <h3 className={styles.modalTitle}>¿Cancelar tu cita?</h3>
                        <p className={styles.modalText}>
                            Esta acción liberará tu espacio para que otro atleta pueda aprovecharlo. ¿Estás seguro?
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setApptToCancel(null)}
                            >
                                No, Volver
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={confirmCancel}
                                disabled={booking}
                            >
                                {booking ? 'Procesando...' : 'Sí, Cancelar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
