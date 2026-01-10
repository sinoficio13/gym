import { GlassCard } from "@/components/ui/GlassCard";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";

export default function BookingPage() {
    return (
        <div style={{
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)'
        }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <h1 style={{
                    fontSize: 'var(--font-size-heading)',
                    fontWeight: 'bold',
                    marginBottom: 'var(--spacing-xs)',
                    color: 'var(--md-sys-color-on-background)'
                }}>Agenda tu Sesión</h1>
                <p style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Selecciona el horario que mejor se adapte a tu rutina.
                </p>
            </div>

            <GlassCard>
                <TimeSlotPicker />
            </GlassCard>
        </div>
    );
}
