'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import styles from './CompleteProfile.module.css';

export default function CompleteProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        full_name: '',
        cedula: '',
        birth_date: '',
        age: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        let mounted = true;
        const fetchProfile = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError || !user) {
                    console.error("Auth Error:", authError);
                    if (mounted) router.push('/login');
                    return;
                }

                const { data: profile, error: dbError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (dbError) console.error("DB Error:", dbError);

                if (profile && mounted) {
                    setFormData(prev => ({
                        ...prev,
                        full_name: profile.full_name || '',
                        birth_date: profile.birth_date || '', // Load existing birth_date
                        age: profile.age?.toString() || '',
                        cedula: profile.cedula || '',
                        phone: profile.phone || '',
                        notes: profile.notes || ''
                    }));
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProfile();

        const timer = setTimeout(() => {
            if (mounted && loading) setLoading(false);
        }, 5000);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, []);

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return '';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age.toString();
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        const age = calculateAge(date);
        setFormData(prev => ({ ...prev, birth_date: date, age }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: formData.full_name,
                cedula: formData.cedula,
                birth_date: formData.birth_date ? formData.birth_date : null,
                age: formData.age ? parseInt(formData.age) : null,
                phone: formData.phone,
                notes: formData.notes,
            })
            .eq('id', user.id);

        if (error) {
            alert('Error: ' + error.message);
        } else {
            router.push('/dashboard/client/booking');
        }
        setLoading(false);
    };

    if (loading) return <div className={styles.container}>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
            </div>

            <GlassCard className={styles.card}>
                <h1 className={styles.title}>
                    Completa tu Perfil
                </h1>
                <p className={styles.subtitle}>
                    Para ofrecerte el mejor plan, necesitamos conocerte mejor.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className={styles.input}
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Tu nombre y apellido"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Cédula / Identificación</label>
                        <input
                            type="text"
                            required
                            className={styles.input}
                            value={formData.cedula}
                            onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                            placeholder="Ej: 12.345.678"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.inputGroup} ${styles.col}`}>
                            <label className={styles.label}>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                required
                                className={styles.input}
                                value={formData.birth_date}
                                onChange={handleDateChange}
                                style={{ colorScheme: 'dark' }} // Force dark calendar icon
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.col}`}>
                            <label className={styles.label}>Edad (Calc)</label>
                            <input
                                type="text"
                                disabled
                                className={styles.input}
                                value={formData.age}
                                placeholder="--"
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>WhatsApp</label>
                        <input
                            type="tel"
                            required
                            className={styles.input}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+58..."
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Objetivo / Notas Médicas</label>
                        <textarea
                            className={styles.input}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Describe tu objetivo o condiciones físicas..."
                            rows={3}
                            style={{ resize: 'none', height: 'auto', minHeight: '80px' }}
                        />
                    </div>

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Guardando...' : 'Comenzar Entrenamiento'}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
}
