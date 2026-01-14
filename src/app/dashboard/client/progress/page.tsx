'use client';

import { GlassCard } from '@/components/ui/GlassCard';

export default function ProgressPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>Mi Progreso</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Visualiza tus avances y estadísticas.</p>
            </div>

            <GlassCard>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
                        En Construcción
                    </h2>
                    <p style={{ color: '#aaa' }}>
                        Estamos preparando las mejores gráficas para ti. <br />
                        Pronto podrás ver tu evolución detallada aquí.
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
