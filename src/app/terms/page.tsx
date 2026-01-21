'use client';

import styles from '@/styles/Legal.module.css';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Volver al Inicio
                </Link>

                <h1 className={styles.title}>Términos y Condiciones</h1>
                <span className={styles.lastUpdated}>Última actualización: Enero 2026</span>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Naturaleza del Servicio</h2>
                    <p className={styles.text}>
                        Euscaris Pereira ofrece servicios de asesoría en entrenamiento físico y planificación deportiva. Nuestros programas están diseñados con base en principios científicos y experiencia competitiva. Sin embargo, los resultados individuales pueden variar y dependen del compromiso y la ejecución del cliente.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Descargo de Responsabilidad Médica</h2>
                    <p className={styles.text}>
                        <strong>Importante:</strong> Euscaris Pereira no es médico ni nutricionista clínico. La información proporcionada tiene fines educativos y de entrenamiento deportivo.
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>Antes de comenzar cualquier programa de ejercicios, debe consultar a su médico.</li>
                        <li className={styles.listItem}>Usted asume toda la responsabilidad por cualquier lesión o riesgo asociado con la práctica de actividad física.</li>
                        <li className={styles.listItem}>Si experimenta dolor, mareos o malestar, detenga el ejercicio inmediatamente y busque atención médica.</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Pagos y Cancelaciones</h2>
                    <p className={styles.text}>
                        Los planes de entrenamiento se abonan por adelantado. No ofrecemos reembolsos una vez enviado el plan de entrenamiento o nutricional, debido a la naturaleza intelectual y personalizada del servicio. Las sesiones de asesoría canceladas con menos de 24 horas de antelación no serán reprogramadas.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Propiedad Intelectual</h2>
                    <p className={styles.text}>
                        Los planes, rutinas y documentos entregados son para uso personal y exclusivo del cliente. Está prohibida su distribución, venta o reproducción total o parcial.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
