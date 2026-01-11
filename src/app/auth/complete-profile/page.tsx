'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import styles from './CompleteProfile.module.css';

export default function CompleteProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Start loading to fetch profile
    const [formData, setFormData] = useState({
        full_name: '',
        cedula: '',
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

                // Fetch existing data
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
                    }));
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProfile();

        // Safety timeout
        const timer = setTimeout(() => {
            if (mounted && loading) setLoading(false);
        }, 5000);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, []);

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
                age: parseInt(formData.age),
                phone: formData.phone,
                notes: formData.notes,
            })
            .eq('id', user.id);

        if (error) {
            alert('Error: ' + error.message);
        } else {
            router.push('/booking');
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
                            <label className={styles.label}>Edad</label>
                            <input
                                type="number"
                                required
                                className={styles.input}
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                placeholder="Ej: 28"
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.col}`}>
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
