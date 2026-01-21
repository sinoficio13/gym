'use client';

import { RevealWrapper } from "../ui/RevealWrapper";
import styles from './ContactSection.module.css';
import { ArrowRight, MessageCircle } from 'lucide-react';

export const ContactSection = () => {
    return (
        <section id="contact" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <RevealWrapper>
                        <span className={styles.label}>Únete a la Élite</span>
                        <h2 className={styles.title}>
                            ESTO NO ES <br /> <span className={styles.highlight}>PARA TODOS</span>
                        </h2>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <p className={styles.description}>
                            Busco compromiso total. Si estás listo para invertir en tu salud, tu estética y tu rendimiento sin excusas, hablemos.
                            Tu transformación comienza con una decisión.
                        </p>
                    </RevealWrapper>

                    <RevealWrapper delay={0.4}>
                        <a
                            href="https://wa.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaButton}
                        >
                            <MessageCircle size={24} />
                            Solicitar Asesoría Personalizada
                        </a>
                        <p className={styles.note}>
                            * Plazas limitadas por mes para asegurar calidad.
                        </p>
                    </RevealWrapper>
                </div>
            </div>

            {/* Ambient Background Glow */}
            <div className={styles.glowEffect}></div>
        </section>
    );
};
