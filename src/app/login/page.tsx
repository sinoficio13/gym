'use client';

import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from './page.module.css';
import { createClient } from '@/lib/supabase/client';
import { useState } from "react";
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const handleEmailLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        setLoading(false);

        // ... (in handleEmailLogin)

        if (error) {
            toast.error("Error al enviar enlace: " + error.message);
        } else {
            toast.success("¡Enlace mágico enviado! Revisa tu correo.");
        }
    };

    return (
        <div className={styles.container}>
            <GlassCard className={styles.loginCard}>
                <h1 className={styles.title}>Bienvenido</h1>
                <p className={styles.subtitle}>Gestiona tu entrenamiento al siguiente nivel.</p>

                <div className={styles.buttonGroup}>
                    <PrimaryButton onClick={handleGoogleLogin} fullWidth>
                        Continuar con Google
                    </PrimaryButton>

                    <div className={styles.divider}>
                        <span>o con email</span>
                    </div>

                    <input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input"
                        style={{ marginBottom: '1rem' }}
                    />
                    <PrimaryButton
                        onClick={handleEmailLogin}
                        fullWidth
                        disabled={loading}
                        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace mágico'}
                    </PrimaryButton>
                </div>
            </GlassCard>
        </div>
    );
}
