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
    const [availableSlots, setAvailableSlots] = useState<string[]>([]); // Dynamic slots from DB
    const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [booking, setBooking] = useState(false);

    // ... (useEffect for weekDays remains same)

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

            // Fallback default hours if DB is empty (optional, better to force config)
            const baseSlots = scheduleData && scheduleData.length > 0
                ? scheduleData.map(s => s.start_time.slice(0, 5)) // Ensure HH:MM format
                : []; // Empty implies closed

            setAvailableSlots(baseSlots);

            if (baseSlots.length === 0) {
                setLoadingSlots(false);
                return; // No need to fetch bookings if closed
            }

            // 2. Fetch Appointments
            const { data: aptData } = await supabase
                .from('appointments')
                .select('start_time, client_id')
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
            const userBookedSlots: string[] = [];
            const adminBlockedSlots: string[] = [];

            if (aptData) {
                aptData.forEach(apt => {
                    const date = new Date(apt.start_time);
                    const timeKey = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
                    slotCounts[timeKey] = (slotCounts[timeKey] || 0) + 1;
                    if (user && apt.client_id === user.id) userBookedSlots.push(timeKey);
                });
            }

            if (blockData) {
                blockData.forEach(block => {
                    const blockStart = new Date(block.start_time);
                    const timeKey = `${blockStart.getHours().toString().padStart(2, '0')}:${blockStart.getMinutes().toString().padStart(2, '0')}`;
                    adminBlockedSlots.push(timeKey);
                });
            }

            // Mark Unavailable
            const blocked = baseSlots.filter(h => {
                const isFull = (slotCounts[h] || 0) >= 3; // Capacity limit
                const isAlreadyBooked = userBookedSlots.includes(h); // Prevent double booking
                const isAdminBlocked = adminBlockedSlots.includes(h); // Admin Block
                return isFull || isAlreadyBooked || isAdminBlocked;
            });

            setUnavailableSlots(blocked);
            setLoadingSlots(false);
        }

        fetchSlots();
    }, [selectedDate, supabase]);

    // ... (handleConfirm remains same)

    // ...

    return (
        <div className={styles.container}>
            {/* ... (Date picker remains same) */}
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
                        const disabled = isTimeDisabled(time);
                        const isSelected = selectedTime === time;
                        return (
                            <button
                                key={time}
                                disabled={disabled}
                                className={`${styles.timeButton} ${isSelected ? styles.selectedTime : ''} ${disabled ? styles.disabledButton : ''}`}
                                onClick={() => !disabled && setSelectedTime(time)}
                            >
                                {formatTime12h(time)}
                                {disabled && <span style={{ display: 'block', fontSize: '0.6rem', color: '#ff6b6b' }}>
                                    Ocupado / Reservado
                                </span>}
                            </button>
                        )
                    })
                )}
            </div>

            {/* ... (Action area remains same) */}
            <div className={styles.actionArea}>
                <PrimaryButton
                    fullWidth
                    disabled={!selectedTime || booking}
                    onClick={handleConfirm}
                    className={!selectedTime ? styles.disabledButton : ''}
                >
                    {booking ? 'Confirmando...' : (selectedTime ? 'Confirmar Reserva' : 'Selecciona una hora')}
                </PrimaryButton>
            </div>
        </div>
    );
};
