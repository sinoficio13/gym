'use client';

import { RevealWrapper } from "../ui/RevealWrapper";
import styles from './ServicesSection.module.css';

const SERVICES = [
    {
        title: "Salud Integral",
        iconImg: "/assets/icon_health.png",
        desc: "Optimiza tu bienestar desde adentro. Programas enfocados en movilidad, resistencia cardiovascular y longevidad activa.",
        highlight: "Tu cuerpo, tu templo."
    },
    {
        title: "Estética & Definición",
        iconImg: "/assets/icon_aesthetics.png",
        desc: "Esculpe cada detalle. Rutinas especializadas en hipertrofia y reducción de grasa para lograr un físico equilibrado y definido.",
        highlight: "El arte del físico."
    },
    {
        title: "Culturismo & Fuerza",
        iconImg: "/assets/icon_strength.png",
        desc: "Entrenamiento de alto rendimiento para quienes buscan superar sus límites. Ganancia muscular seria y técnica de precisión.",
        highlight: "Libera tu potencial."
    }
];

export const ServicesSection = () => {
    return (
        <section id="services" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Programas Diseñados para Ti</h2>
                    <p className={styles.subtitle}>
                        No importa tu punto de partida, tengo el camino exacto para llegar a tu meta.
                    </p>
                </div>

                <div className={styles.grid}>
                    {SERVICES.map((s, i) => (
                        <RevealWrapper key={i} delay={i * 0.2}>
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>
                                    <img src={s.iconImg} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <h3 className={styles.cardTitle}>{s.title}</h3>
                                <p className={styles.cardDesc}>
                                    {s.desc} <br /><br />
                                    <span className={styles.highlight}>{s.highlight}</span>
                                </p>
                            </div>
                        </RevealWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
};
