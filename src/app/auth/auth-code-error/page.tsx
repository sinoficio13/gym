'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import Link from 'next/link';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');

    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff6b6b' }}>Error de Autenticación</h1>
            <p style={{ marginBottom: '2rem', color: '#ccc' }}>
                Hubo un problema al iniciar sesión con Google.
            </p>

            <div style={{
                background: 'rgba(255,0,0,0.1)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                color: 'white' // Force white text
            }}>
                <p><strong>Error:</strong> {error || 'Desconocido'}</p>
                <p><strong>Código:</strong> {errorCode || '-'}</p>
                <p><strong>Descripción:</strong> {errorDescription || 'Sin descripción'}</p>

                {/* Debug: Show complete URL params if needed */}
                <details style={{ marginTop: '10px', fontSize: '0.7rem', opacity: 0.7 }}>
                    <summary>Debug Info</summary>
                    <pre>{JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</pre>
                </details>
            </div>

            <Link href="/login">
                <PrimaryButton>Volver al Login</PrimaryButton>
            </Link>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <GlassCard>
                <Suspense fallback={<div>Cargando detalles del error...</div>}>
                    <ErrorContent />
                </Suspense>
            </GlassCard>
        </div>
    );
}
