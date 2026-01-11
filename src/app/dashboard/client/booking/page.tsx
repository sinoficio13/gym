'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";

export default function ClientBookingPage() {
    return (
        <div style={{
            width: '100%',
            maxWidth: '100%', // Use full width of container
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>Agenda tu Sesión</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Elige el horario que mejor te convenga.</p>
            </div>

            <GlassCard>
                <TimeSlotPicker />
            </GlassCard>
        </div>
    );
}
