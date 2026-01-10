import { GlassCard } from "@/components/ui/GlassCard";

// Mock Appointments
const APPOINTMENTS = [
    { id: 1, date: 'Lun 12', time: '08:30', client: 'Ana García', status: 'Confirmada' },
    { id: 2, date: 'Lun 12', time: '10:00', client: 'Carlos Pérez', status: 'Pendiente' },
    { id: 3, date: 'Mar 13', time: '16:00', client: 'Laura Torres', status: 'Confirmada' },
];

export default function AdminDashboard() {
    return (
        <div style={{ width: '100%', maxWidth: '1000px' }}>
            <h1 style={{
                fontSize: 'var(--font-size-heading)',
                marginBottom: 'var(--spacing-lg)',
                color: 'var(--md-sys-color-on-background)'
            }}>Panel de Control</h1>

            <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Stats Card */}
                <GlassCard>
                    <h3 style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem' }}>Citas Hoy</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--md-sys-color-primary)' }}>2</p>
                </GlassCard>
                <GlassCard>
                    <h3 style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem' }}>Citas Semana</h3>
                    <p style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--md-sys-color-tertiary)' }}>15</p>
                </GlassCard>
            </div>

            <h2 style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)', fontSize: '1.5rem' }}>Próximas Sesiones</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {APPOINTMENTS.map(apt => (
                    <GlassCard key={apt.id} style={{ padding: '16px 24px' }}>
                        <div className="flex justify-between items-center w-full">
                            <div>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{apt.client}</p>
                                <p style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '0.9rem' }}>
                                    {apt.date} • {apt.time}
                                </p>
                            </div>
                            <div style={{
                                padding: '6px 12px',
                                borderRadius: '100px',
                                background: apt.status === 'Confirmada' ? 'rgba(75, 181, 67, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                                color: apt.status === 'Confirmada' ? '#4bb543' : '#ffc107',
                                fontWeight: '600',
                                fontSize: '0.8rem'
                            }}>
                                {apt.status}
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
