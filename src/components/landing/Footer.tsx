'use client';

import styles from './Footer.module.css';
import { Instagram, Smartphone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brandColumn}>
                    <h3 className={styles.brandTitle}>EUSCARIS PEREIRA</h3>
                    <p className={styles.brandTagline}>
                        Ciencia, disciplina y resultados reales. Tu legado comienza con una decisión.
                    </p>
                    <div className={styles.socialRow}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <Instagram size={20} />
                        </a>
                        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                            <Smartphone size={20} />
                        </a>
                        <a href="mailto:contact@euscarispereira.com" className={styles.socialIcon}>
                            <Mail size={20} />
                        </a>
                    </div>
                </div>

                <div className={styles.linksGrid}>
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Navegación</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/#hero" className={styles.link}>Inicio</Link></li>
                            <li><Link href="/#about" className={styles.link}>Sobre Mí</Link></li>
                            <li><Link href="/#trajectory" className={styles.link}>Trayectoria</Link></li>
                            <li><Link href="/#philosophy" className={styles.link}>Metodología</Link></li>
                            <li><Link href="/#services" className={styles.link}>Planes</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Legal</h4>
                        <ul className={styles.linkList}>
                            <li><Link href="/privacy" className={styles.link}>Privacidad</Link></li>
                            <li><Link href="/terms" className={styles.link}>Términos</Link></li>
                            <li><Link href="/cookies" className={styles.link}>Cookies</Link></li>
                        </ul>
                    </div>

                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Contacto</h4>
                        <ul className={styles.linkList}>
                            <li className={styles.contactItem}>
                                <Mail size={16} className={styles.contactIcon} />
                                <span>info@euscarispereira.com</span>
                            </li>
                            <li className={styles.contactItem}>
                                <MapPin size={16} className={styles.contactIcon} />
                                <span>Online / Global</span>
                            </li>
                        </ul>
                        <a href="https://wa.me/" className={styles.ctaButton}>
                            Agenda tu llamada <ArrowUpRight size={16} />
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <p className={styles.copyright}>
                    © {new Date().getFullYear()} Euscaris Pereira. Todos los derechos reservados.
                </p>
                <p className={styles.signature}>
                    Forjada en Acero y Ciencia.
                </p>
            </div>
        </footer>
    );
};
