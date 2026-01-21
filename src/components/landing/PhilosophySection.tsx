'use client';

import { RevealWrapper } from "../ui/RevealWrapper";
import styles from './PhilosophySection.module.css';
import { Ruler, Scale, Activity } from 'lucide-react';

export const PhilosophySection = () => {
    return (
        <section id="philosophy" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.imageColumn}>
                    <RevealWrapper delay={0.2} direction="right">
                        <div className={styles.imageCard}>
                            <img
                                src="/assets/isak_placeholder.png"
                                alt="Medición Cineantropométrica ISAK"
                                className={styles.image}
                            />
                            <div className={styles.overlay}>
                                <span className={styles.certBadge}>CERTIFICACIÓN INTERNACIONAL</span>
                            </div>
                        </div>
                    </RevealWrapper>
                </div>

                <div className={styles.contentColumn}>
                    <RevealWrapper>
                        <span className={styles.label}>Precisión Científica</span>
                        <h2 className={styles.title}>
                            ESTÁNDAR<br />ISAK NIVEL 1
                        </h2>
                    </RevealWrapper>

                    <RevealWrapper delay={0.4}>
                        <p className={styles.description}>
                            Olvídate de las suposiciones. Mientras el peso fluctúa por variables irrelevantes como el agua o el glucógeno,
                            la cineantropometría me permite diseccionar tu composición corporal con precisión quirúrgica, tomando decisiones basadas en datos reales.
                        </p>
                    </RevealWrapper>

                    <div className={styles.features}>
                        <RevealWrapper delay={0.5}>
                            <div className={styles.featureItem}>
                                <Ruler className={styles.icon} size={24} />
                                <div>
                                    <h4 className={styles.featureTitle}>Medición de Pliegues Cutáneos</h4>
                                    <p className={styles.featureText}>
                                        Utilizo calibres homologados para cuantificar cada milímetro de tejido adiposo y determinar exactamente cuánto es grasa y cuánto es piel, eliminando cualquier margen de error.
                                    </p>
                                </div>
                            </div>
                        </RevealWrapper>

                        <RevealWrapper delay={0.6}>
                            <div className={styles.featureItem}>
                                <Scale className={styles.icon} size={24} />
                                <div>
                                    <h4 className={styles.featureTitle}>Masa Muscular Real</h4>
                                    <p className={styles.featureText}>
                                        Monitoreo tu hipertrofia pura. Discierno si tu aumento de peso es tejido contráctil funcional o simplemente retención, asegurando que cada repetición se traduzca en avances reales.
                                    </p>
                                </div>
                            </div>
                        </RevealWrapper>

                        <RevealWrapper delay={0.7}>
                            <div className={styles.featureItem}>
                                <Activity className={styles.icon} size={24} />
                                <div>
                                    <h4 className={styles.featureTitle}>Evidencia, No Opinión</h4>
                                    <p className={styles.featureText}>
                                        Transformo tu cuerpo en números accionables. Ajusto tus macros y cargas de entrenamiento basándome en tu somatotipo y respuesta biológica individual, sin adivinanzas.
                                    </p>
                                </div>
                            </div>
                        </RevealWrapper>
                    </div>
                </div>
            </div>
        </section>
    );
};
