'use client';

import React, { useState } from 'react';
import { PrimaryButton } from '../ui/PrimaryButton';
import styles from './TimeSlotPicker.module.css';

// Mock data generator
const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DATES = Array.from({ length: 6 }, (_, i) => 12 + i); // Mock dates 12-17
const TIMES = ['07:00', '08:30', '10:00', '16:00', '17:30', '19:00'];

export const TimeSlotPicker = () => {
    const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const handleConfirm = () => {
        alert(`Reserva Confirmada: Día ${DATES[selectedDayIndex]} a las ${selectedTime}`);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.sectionTitle}>1. Elige el día</h3>
            <div className={styles.daysGrid}>
                {DAYS.map((day, index) => (
                    <button
                        key={index}
                        className={`${styles.dayButton} ${selectedDayIndex === index ? styles.selectedDay : ''}`}
                        onClick={() => { setSelectedDayIndex(index); setSelectedTime(null); }}
                    >
                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{day}</span>
                        <span className={styles.dateNumber}>{DATES[index]}</span>
                    </button>
                ))}
            </div>

            <h3 className={styles.sectionTitle}>2. Elige la hora disponible</h3>
            <div className={styles.timesGrid}>
                {TIMES.map((time) => (
                    <button
                        key={time}
                        className={`${styles.timeButton} ${selectedTime === time ? styles.selectedTime : ''}`}
                        onClick={() => setSelectedTime(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className={styles.actionArea}>
                <PrimaryButton
                    fullWidth
                    disabled={!selectedTime}
                    onClick={handleConfirm}
                    className={!selectedTime ? styles.disabledButton : ''}
                >
                    {selectedTime ? 'Confirmar Reserva' : 'Selecciona una hora'}
                </PrimaryButton>
            </div>
        </div>
    );
};
