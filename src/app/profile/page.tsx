'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        medical_info: '', // We'll store this as JSON string for simplicity in the UI input, but object in DB
        goals: ''
    });

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);

            // Fetch existing profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    medical_info: data.medical_info?.injuries || '',
                    goals: data.medical_info?.goals || ''
                });
            }
            setLoading(false);
        }
        getProfile();
    }, [router, supabase]);

    const handleSubmit = async () => {
        setUpdating(true);
        const medicalJson = {
            injuries: formData.medical_info,
            goals: formData.goals
        };

        const updates = {
            id: user.id,
            full_name: formData.full_name,
            phone: formData.phone,
            medical_info: medicalJson,
            updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        setUpdating(false);

        if (error) {
            alert('Error actualizando perfil: ' + error.message);
        } else {
            alert('Perfil actualizado correctamente');
            router.push('/booking'); // Redirect to booking after saving
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Cargando perfil...</div>;

    return (
        <div style={{ width: '100%', maxWidth: '600px' }}>
            <GlassCard>
                <h1 className="text-2xl font-bold mb-6 text-white text-center">Completa tu Ficha</h1>
                <p className="mb-6 text-gray-300 text-center text-sm">
                    Necesitamos estos datos para adaptar tu entrenamiento y contactarte.
                </p>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            className="glass-input"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">WhatsApp / Teléfono</label>
                        <input
                            type="tel"
                            className="glass-input"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+591 ..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Lesiones o Condiciones Médicas</label>
                        <textarea
                            className="glass-input"
                            rows={3}
                            value={formData.medical_info}
                            onChange={e => setFormData({ ...formData, medical_info: e.target.value })}
                            placeholder="Ej. Dolor de rodilla derecha, asma..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Objetivos</label>
                        <textarea
                            className="glass-input"
                            rows={2}
                            value={formData.goals}
                            onChange={e => setFormData({ ...formData, goals: e.target.value })}
                            placeholder="Ej. Bajar de peso, ganar masa muscular..."
                        />
                    </div>

                    <PrimaryButton onClick={handleSubmit} disabled={updating} fullWidth className="mt-4">
                        {updating ? 'Guardando...' : 'Guardar y Continuar'}
                    </PrimaryButton>
                </div>
            </GlassCard>
        </div>
    );
}
