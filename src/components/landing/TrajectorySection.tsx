'use client';

import { RevealWrapper } from "../ui/RevealWrapper";
import styles from './TrajectorySection.module.css';
import { Trophy, Medal, Flame } from 'lucide-react';

export const TrajectorySection = () => {
    return (
        <section id="trajectory" className={styles.section}>
            <div className={styles.container}>
                <div>
                    <RevealWrapper>
                        <span className={styles.label}>Trayectoria de Acero</span>
                    </RevealWrapper>

                    <RevealWrapper delay={0.2}>
                        <h2 className={styles.title}>FORJADA EN LA COMPETENCIA</h2>
                    </RevealWrapper>

                    <RevealWrapper delay={0.4}>
                        <p className={styles.description}>
                            No soy una entrenadora de biblioteca. Mi conocimiento ha sido probado en el tatami y en la arena internacional.
                            Sé lo que significa disciplina, corte de peso y rendimiento bajo presión absoluta.
                        </p>
                    </RevealWrapper>

                    <div className={styles.achievementsGrid}>
                        <RevealWrapper delay={0.5}>
                            <div className={styles.achievementItem}>
                                <div className={styles.iconWrapper}>
                                    <Trophy size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className={styles.achievementTitle}>Campeona de Sumo</h4>
                                    <p className={styles.achievementDetail}>
                                        Dominio absoluto del centro de gravedad, fuerza isométrica y explosividad en distancias cortas.
                                    </p>
                                </div>
                            </div>
                        </RevealWrapper>

                        <RevealWrapper delay={0.6}>
                            <div className={styles.achievementItem}>
                                <div className={styles.iconWrapper}>
                                    <Medal size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className={styles.achievementTitle}>Selección Nacional de Judo</h4>
                                    <p className={styles.achievementDetail}>
                                        Maestría técnica en desequilibrios (Kuzushi), proyecciones de alto impacto y estrategia de combate olímpico.
                                    </p>
                                </div>
                            </div>
                        </RevealWrapper>

                        <RevealWrapper delay={0.7}>
                            <div className={styles.achievementItem}>
                                <div className={styles.iconWrapper}>
                                    <Flame size={24} strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className={styles.achievementTitle}>Selección Nacional de Sambo</h4>
                                    <p className={styles.achievementDetail}>
                                        Versatilidad total en combate: transiciones fluidas, luxaciones precisas y una capacidad anaeróbica superior.
                                    </p>
                                </div>
                            </div>
                        </RevealWrapper>
                    </div>
                </div>

                <div className={styles.imageGrid}>
                    <RevealWrapper delay={0.4} direction="left">
                        <div className={styles.imageCard}>
                            <img src="/assets/judo_placeholder.png?v=2" alt="Judo Competition" className={styles.imagePlaceholder} />
                            <div className={styles.imageLabel}>JUDO</div>
                        </div>
                    </RevealWrapper>

                    <RevealWrapper delay={0.6} direction="left">
                        <div className={styles.imageCard} style={{ marginTop: '80px' }}>
                            <img src="/assets/sumo_placeholder.png?v=2" alt="Sumo Competition" className={styles.imagePlaceholder} />
                            <div className={styles.imageLabel}>SUMO</div>
                        </div>
                    </RevealWrapper>

                    <RevealWrapper delay={0.8} direction="left">
                        <div className={styles.imageCard}>
                            <img src="/assets/sambo_placeholder.png?v=2" alt="Sambo Competition" className={styles.imagePlaceholder} />
                            <div className={styles.imageLabel}>SAMBO</div>
                        </div>
                    </RevealWrapper>
                </div>
            </div>
        </section>
    );
};
