'use client';

import styles from './AboutSection.module.css';
import { RevealWrapper } from "../ui/RevealWrapper";
import { CountUp } from "../ui/CountUp";

export const AboutSection = () => {
    return (
        <section id="about" className={styles.section}>
            <div className={styles.container}>
                {/* Image Placeholder */}
                <RevealWrapper direction="right">
                    <div className={styles.imageContainer}>
                        <img
                            src="/assets/trainer_portrait.png"
                            alt="Euscaris Pereira"
                            className={styles.profileImage}
                        />

                        {/* Overlay Gradient */}
                        <div className={styles.imageOverlay}></div>
                    </div>
                </RevealWrapper>

                {/* Content */}
                <div>
                    <RevealWrapper delay={0.2}>
                        <span className={styles.preTitle}>Soy Euscaris Pereira</span>
                    </RevealWrapper>

                    <RevealWrapper delay={0.4}>
                        <h2 className={styles.title}>
                            TU LÍDER EN <br /> TRANSFORMACIÓN
                        </h2>
                    </RevealWrapper>

                    <RevealWrapper delay={0.6}>
                        <div className={styles.quoteContainer}>
                            <p className={styles.quote}>
                                "Con años de experiencia forjando físicos y mentalidades, mi enfoque va más allá de contar repeticiones.
                                Entiendo que cada cuerpo cuenta una historia diferente."
                            </p>
                        </div>
                    </RevealWrapper>

                    <RevealWrapper delay={0.8}>
                        <p className={styles.description}>
                            Mi misión es darte las herramientas técnicas y el soporte emocional para que descubras de lo que eres realmente capaz.
                            Ya sea que busques salud, estética competitiva o simplemente sentirte poderosa/o.
                        </p>
                    </RevealWrapper>

                    <RevealWrapper delay={1.0}>
                        <div className={styles.statsContainer}>
                            <div>
                                <h4 className={styles.statNumber}>
                                    +<CountUp end={500} duration={2000} />
                                </h4>
                                <span className={styles.statLabel}>Vidas Cambiadas</span>
                            </div>
                            <div>
                                <h4 className={styles.statNumber}>
                                    <CountUp end={100} duration={2000} />%
                                </h4>
                                <span className={styles.statLabel}>Compromiso</span>
                            </div>
                        </div>
                    </RevealWrapper>
                </div>
            </div>
        </section>
    );
};
