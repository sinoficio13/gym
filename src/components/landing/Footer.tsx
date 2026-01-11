'use client';

export const Footer = () => {
    return (
        <footer style={{
            padding: '80px 24px',
            background: 'url(/assets/texture_dark.png), #050505',
            backgroundBlendMode: 'overlay',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center',
            position: 'relative'
        }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>EUCARIS PEREIRA</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '32px' }}>Tu mejor versión comienza hoy.</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '40px' }}>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Instagram</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>WhatsApp</a>
                <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Email</a>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
                © 2026 Eucaris Pereira Fitness. Todos los derechos reservados.
            </p>
        </footer>
    );
};
