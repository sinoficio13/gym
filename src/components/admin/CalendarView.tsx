'use client';

import React, { useState, useEffect } from 'react';
import styles from './CalendarView.module.css';
import { createClient } from '@/lib/supabase/client';

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 to 21:00

// Mock Data for Demo
const MOCK_APPOINTMENTS = [
    {
        id: '1',
        profiles: { full_name: 'Ana García' },
        start_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0] + 'T07:00:00.000Z', // Monday 07:00
        end_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0] + 'T08:00:00.000Z', // Monday 08:00
        status: 'confirmed',
        type: 'Fuerza'
    },
    {
        id: '2',
        profiles: { full_name: 'Carlos Ruiz' },
        start_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0] + 'T18:00:00.000Z', // Monday 18:00
        end_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 1)).toISOString().split('T')[0] + 'T19:00:00.000Z', // Monday 19:00
        status: 'pending',
        type: 'Hipertrofia'
    },
    {
        id: '3',
        profiles: { full_name: 'María Rodriguez' },
        start_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).toISOString().split('T')[0] + 'T09:00:00.000Z', // Wednesday 09:00
        end_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 3)).toISOString().split('T')[0] + 'T10:00:00.000Z', // Wednesday 10:00
        status: 'confirmed',
        type: 'Pérdida de Peso'
    },
    {
        id: '4',
        profiles: { full_name: 'Juan Perez' },
        start_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).toISOString().split('T')[0] + 'T19:00:00.000Z', // Thursday 19:00
        end_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 4)).toISOString().split('T')[0] + 'T20:00:00.000Z', // Thursday 20:00
        status: 'confirmed',
        type: 'Funcional'
    },
    {
        id: '5',
        profiles: { full_name: 'Sofia Lopez' },
        start_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 5)).toISOString().split('T')[0] + 'T08:00:00.000Z', // Friday 08:00
        end_time: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 5)).toISOString().split('T')[0] + 'T09:00:00.000Z', // Friday 09:00
        status: 'pending',
        type: 'Estiramiento'
    }
];

export const CalendarView = () => {
    // const supabase = createClient(); // Commented out for mock data
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<any[]>(MOCK_APPOINTMENTS);
    const [loading, setLoading] = useState(false); // Disable loading for mock

    // Get Start/End of current week
    const getWeekRange = (date: Date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Sunday
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };

    const loadAppointments = async () => {
        setLoading(true);
        // const { start, end } = getWeekRange(currentDate);

        // Fetch appointments with Profile data
        // const { data, error } = await supabase
        //     .from('appointments')
        //     .select('*, profiles(full_name)')
        //     .gte('start_time', start.toISOString())
        //     .lte('start_time', end.toISOString());

        // if (data) setAppointments(data);
        // setAppointments(MOCK_APPOINTMENTS); // Force Mock Data
        setLoading(false);
    };

    useEffect(() => {
        loadAppointments();
    }, [currentDate]);

    const changeWeek = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (offset * 7));
        setCurrentDate(newDate);
    };

    const days = [];
    const { start } = getWeekRange(currentDate);
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d);
    }

    // Calcular posición top/height basado en hora
    const getAppointmentStyle = (startTime: string, endTime: string) => {
        const start = new Date(startTime);
        const end = new Date(endTime);

        // Base hour 6:00
        const startHour = start.getHours() + (start.getMinutes() / 60);
        const endHour = end.getHours() + (end.getMinutes() / 60);

        const top = (startHour - 6) * 60; // 60px per hour
        const height = (endHour - startHour) * 60;

        return { top: `${top}px`, height: `${height}px` };
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => changeWeek(-1)} className={styles.navButton}>&larr; Anterior</button>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {start.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </div>
                <button onClick={() => changeWeek(1)} className={styles.navButton}>Siguiente &rarr;</button>
            </div>

            <div className={styles.grid}>
                {/* Time Column */}
                <div className={styles.timeColumn}>
                    <div className={styles.dayHeader} style={{ borderBottom: 'none' }}></div> {/* Spacing */}
                    {HOURS.map(h => (
                        <div key={h} className={styles.timeLabel}>
                            {h}:00
                        </div>
                    ))}
                </div>

                {/* Days Columns */}
                {days.map((day, i) => (
                    <div key={i} className={styles.dayColumn}>
                        <div className={`${styles.dayHeader} ${day.toDateString() === new Date().toDateString() ? styles.currentDayHeader : ''}`}>
                            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{day.getDate()}</div>
                        </div>

                        {/* Grid Lines */}
                        {HOURS.map(h => <div key={h} className={styles.hourCell}></div>)}

                        {/* Appointments Overlay */}
                        {appointments
                            .filter(apt => new Date(apt.start_time).getDate() === day.getDate())
                            .map(apt => (
                                <div
                                    key={apt.id}
                                    className={`${styles.appointment} ${styles[`status_${apt.status}`]}`}
                                    style={getAppointmentStyle(apt.start_time, apt.end_time)}
                                    title={`${apt.profiles?.full_name || 'Cliente'} - ${new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                >
                                    <div style={{ fontWeight: '600' }}>{new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div>{apt.profiles?.full_name || 'Desconocido'}</div>
                                </div>
                            ))
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};
