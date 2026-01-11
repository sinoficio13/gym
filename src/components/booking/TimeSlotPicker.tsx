'use client';

import React, { useState, useEffect } from 'react';
import { PrimaryButton } from '../ui/PrimaryButton';
import styles from './TimeSlotPicker.module.css';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const DAYS_MAP = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = ['07:00', '08:30', '10:00', '16:00', '17:30', '19:00', '20:30'];

export const TimeSlotPicker = () => {
    const supabase = createClient();
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [unavailableSlots, setUnavailableSlots] = useState<string[]>([]);
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
            // Start of day
            const startOfDay = new Date(selectedDate!);
            startOfDay.setHours(0, 0, 0, 0);

            // End of day
            const endOfDay = new Date(selectedDate!);
            endOfDay.setHours(23, 59, 59, 999);

            const { data, error } = await supabase
                .from('appointments')
                .select('start_time')
                .gte('start_time', startOfDay.toISOString())
                .lte('start_time', endOfDay.toISOString())
                .neq('status', 'cancelled');

            if (data) {
                // Extract blocked hours "HH:MM"
                const blocked = data.map(apt => {
                    const date = new Date(apt.start_time);
                    // Adjust to local time string simpler
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                });
                setUnavailableSlots(blocked);
            }
            setLoadingSlots(false);
        }

        fetchSlots();
    }, [selectedDate, supabase]);

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime) return;
        setBooking(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Debes iniciar sesión para reservar.");
            router.push('/login');
            return;
        }

        // Check profile
        const { data: profile } = await supabase.from('profiles').select('id, full_name').eq('id', user.id).single();
        if (!profile || !profile.full_name) {
            alert("Por favor completa tu perfil antes de reservar.");
            router.push('/profile');
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
                status: 'confirmed' // Auto confirm for now
            });

        setBooking(false);

        if (error) {
            alert('Error al reservar: ' + error.message);
        } else {
            alert('¡Reserva Exitosa!');
            // Refresh slots
            setSelectedTime(null);
            // Force reload slots logic? simpler to just reload page or reset state
            window.location.reload();
        }
    };

    const isTimeDisabled = (time: string) => unavailableSlots.includes(time);

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
                {HOURS.map((time) => {
                    const disabled = isTimeDisabled(time);
                    const isSelected = selectedTime === time;
                    return (
                        <button
                            key={time}
                            disabled={disabled}
                            className={`${styles.timeButton} ${isSelected ? styles.selectedTime : ''} ${disabled ? styles.disabledButton : ''}`}
                            onClick={() => !disabled && setSelectedTime(time)}
                        >
                            {time}
                            {disabled && <span style={{ display: 'block', fontSize: '0.6rem', color: '#ff6b6b' }}>Ocupado</span>}
                        </button>
                    )
                })}
            </div>

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
