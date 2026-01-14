'use client';

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from './HeroSection.module.css';
import Link from "next/link";
import { RevealWrapper } from "../ui/RevealWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const HeroSection = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // AUTO-FIX: If Supabase redirects to home with ?code=..., forward to callback
    useEffect(() => {
        const code = searchParams.get("code");
        if (code) {
            console.log("Detectado código OAuth en landing. Redirigiendo a callback...");
            // Force hard redirect to ensure middleware/server logic runs
            window.location.href = `/auth/callback?code=${code}`;
        }
    }, [searchParams, router]);

    return (
        <section className={styles.heroContainer}>
            {/* Background elements */}
            <img
                src="/assets/hero-bg.png?v=new2"
                alt="Atmósfera Gym Premium"
                className={styles.heroImage}
            />
            <div className={styles.overlay}></div>

            {/* Content */}
            <div className={styles.content}>
                <RevealWrapper delay={0.2} direction="down">
                    <span className={styles.preTitle}>Eucaris Pereira</span>
                </RevealWrapper>

                <RevealWrapper delay={0.4}>
                    <h1 className={styles.title}>
                        ESCULPE TU LEGADO
                    </h1>
                </RevealWrapper>

                <RevealWrapper delay={0.6}>
                    <p className={styles.subtitle}>
                        Más que un entrenamiento. Es tu salud, tu estética y tu máximo potencial.
                        Únete a la élite del fitness personalizado.
                    </p>
                </RevealWrapper>

                <RevealWrapper delay={0.8}>
                    <div className={styles.buttonGroup}>
                        <Link href="/dashboard/client">
                            {/* @ts-ignore */}
                            <PrimaryButton style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                                Empezar Ahora
                            </PrimaryButton>
                        </Link>

                        <button
                            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: '16px 32px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Ver Programas
                        </button>
                    </div>
                </RevealWrapper>
            </div>
        </section>
    );
};
