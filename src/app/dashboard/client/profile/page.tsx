'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [userMetadata, setUserMetadata] = useState<any>(null);

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    // const [alias, setAlias] = useState(''); // Removed alias
    const [birthDate, setBirthDate] = useState('');
    const [trainingGoal, setTrainingGoal] = useState('');
    const [notes, setNotes] = useState('');

    const TRAINING_GOALS = [
        { value: 'hypertrophy', label: 'Ganar Masa Muscular (Hipertrofia)' },
        { value: 'weight_loss', label: 'Pérdida de Peso / Grasa' },
        { value: 'strength', label: 'Ganar Fuerza Pura' },
        { value: 'definition', label: 'Definición / Tonificación' },
        { value: 'health', label: 'Salud General y Bienestar' },
        { value: 'sport', label: 'Rendimiento Deportivo' },
        { value: 'rehab', label: 'Rehabilitación / Prevención de Lesiones' },
    ];

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUserMetadata(user.user_metadata);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setFullName(data.full_name || '');
                setPhone(data.phone || '');
                // setAlias(data.alias || '');
                setBirthDate(data.birth_date || '');
                setTrainingGoal(data.training_goal || '');
                setNotes(data.notes || '');
            }
            setLoading(false);
        };

        getProfile();
    }, [supabase, router]);

    const handleUpdate = async () => {
        setUpdating(true);
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                phone: phone,
                // alias: alias,
                birth_date: birthDate,
                training_goal: trainingGoal,
                notes: notes,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

        // ... (in handleUpdate)

        if (error) {
            toast.error('Error al actualizar: ' + error.message);
        } else {
            toast.success('Perfil actualizado correctamente ✨');
        }
        setUpdating(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (loading) {
        return <div style={{ color: 'white', padding: '20px' }}>Cargando perfil...</div>;
    }

    const avatarUrl = userMetadata?.avatar_url;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white' }}>Mi Perfil</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>Gestiona tu información personal y preferencias.</p>
            </div>

            <GlassCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Sección Avatar (Visual) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid rgba(255,255,255,0.2)'
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {fullName ? fullName[0] : 'U'}
                            </div>
                        )}
                        <div>
                            <h3 style={{ color: 'white', margin: 0 }}>{userMetadata?.email}</h3>
                            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Cliente Premium Plan</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#d0bcff', marginBottom: '8px', fontSize: '0.9rem' }}>Nombre Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#d0bcff', marginBottom: '8px', fontSize: '0.9rem' }}>Teléfono / WhatsApp</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#d0bcff', marginBottom: '8px', fontSize: '0.9rem' }}>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(0,0,0,0.2)', // Fondo oscuro para input date
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    colorScheme: 'dark' // Fuerza calendario oscuro en navegadores compatibles
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#d0bcff', marginBottom: '8px', fontSize: '0.9rem' }}>Objetivo Principal</label>
                            <select
                                value={trainingGoal}
                                onChange={(e) => setTrainingGoal(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    appearance: 'none', // Remove default arrow
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="" disabled>Selecciona tu objetivo</option>
                                {TRAINING_GOALS.map((goal) => (
                                    <option key={goal.value} value={goal.value} style={{ background: '#1e1e2d', color: 'white' }}>
                                        {goal.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#d0bcff', marginBottom: '8px', fontSize: '0.9rem' }}>Notas Adicionales (Lesiones, Preferencias...)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <PrimaryButton
                        onClick={handleUpdate}
                        disabled={updating}
                        fullWidth
                    >
                        {updating ? 'Guardando...' : 'Guardar Cambios'}
                    </PrimaryButton>

                    <div style={{ margin: '20px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></div>

                    {/* Zona de Peligro / Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'rgba(255, 59, 48, 0.1)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                            color: '#ff453a',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        Cerrar Sesión
                    </button>

                </div>
            </GlassCard>
        </div>
    );
}
