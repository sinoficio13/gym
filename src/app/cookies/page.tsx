'use client';

import styles from '@/styles/Legal.module.css';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
    return (
        <div className={styles.container}>
            <div className={styles.contentWrapper}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} />
                    Volver al Inicio
                </Link>

                <h1 className={styles.title}>Política de Cookies</h1>
                <span className={styles.lastUpdated}>Última actualización: Enero 2026</span>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. ¿Qué son las Cookies?</h2>
                    <p className={styles.text}>
                        Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Nos ayudan a mejorar su experiencia de usuario y analizar el rendimiento del sitio.
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Cookies que Utilizamos</h2>
                    <ul className={styles.list}>
                        <li className={styles.listItem}>
                            <strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio, como el acceso seguro a su área de cliente.
                        </li>
                        <li className={styles.listItem}>
                            <strong>Cookies de Rendimiento:</strong> Nos ayudan a entender cómo interactúan los visitantes con la página (por ejemplo, Google Analytics) de forma anónima.
                        </li>
                        <li className={styles.listItem}>
                            <strong>Cookies de Funcionalidad:</strong> Recuerdan sus preferencias (como el idioma o la sesión iniciada) para ofrecerle una experiencia más fluida.
                        </li>
                    </ul>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Gestión de Cookies</h2>
                    <p className={styles.text}>
                        Puede configurar su navegador para rechazar todas o algunas cookies. Sin embargo, tenga en cuenta que si bloquea las cookies esenciales, es posible que algunas partes de nuestro sitio (como el Dashboard de Cliente) no funcionen correctamente.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
