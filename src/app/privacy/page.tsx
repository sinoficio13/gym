'use client';

import styles from '@/styles/Legal.module.css';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Volver al Inicio
                </Link>

                <h1 className={styles.title}>Política de Privacidad</h1>
                <span className={styles.lastUpdated}>Última actualización: Enero 2026</span>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Introducción</h2>
                    <p className={styles.text}>
                        En <strong>Euscaris Pereira Fitness</strong> ("nosotros", "nuestro"), valoramos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política explica cómo recopilamos, usamos y salvaguardamos su información cuando utiliza nuestros servicios de entrenamiento y asesoría online.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Información que Recopilamos</h2>
                    <p className={styles.text}>
                        Para brindar nuestros servicios de alto rendimiento, podemos recopilar la siguiente información:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}><strong>Información Personal:</strong> Nombre, correo electrónico, número de teléfono.</li>
                        <li className={styles.listItem}><strong>Datos de Salud y Físicos:</strong> Peso, altura, medidas corporales (ISAK), historial de lesiones y objetivos de fitness.</li>
                        <li className={styles.listItem}><strong>Material Visual:</strong> Fotografías y videos para la evaluación técnica y seguimiento del progreso (bajo estricta confidencialidad).</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Uso de la Información</h2>
                    <p className={styles.text}>
                        Utilizamos sus datos exclusivamente para:
                    </p>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>Diseñar planes de entrenamiento y nutrición 100% personalizados.</li>
                        <li className={styles.listItem}>Monitorear su progreso y realizar ajustes técnicos.</li>
                        <li className={styles.listItem}>Comunicarnos con usted a través de WhatsApp o correo electrónico para soporte.</li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Protección de Datos</h2>
                    <p className={styles.text}>
                        Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra el acceso no autorizado. Sus fotos de progreso y datos médicos nunca serán compartidos públicamente sin su consentimiento explícito y por escrito.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Contacto</h2>
                    <p className={styles.text}>
                        Si tiene preguntas sobre esta política, contáctenos en: info@euscarispereira.com
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
