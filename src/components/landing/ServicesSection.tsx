'use client';

import { useState, useRef, useEffect } from "react";
import { RevealWrapper } from "../ui/RevealWrapper";
import styles from './ServicesSection.module.css';
import { Dumbbell, HeartPulse, Stethoscope, Activity, Flame } from 'lucide-react';

const SERVICES = [
    {
        title: "Salud Integral",
        Icon: Activity,
        desc: "Optimiza tu bienestar desde adentro. Programas enfocados en movilidad, resistencia cardiovascular y longevidad activa.",
        highlight: "Tu cuerpo, tu templo."
    },
    {
        title: "Estética & Definición",
        Icon: Flame,
        desc: "Esculpe cada detalle. Rutinas especializadas en hipertrofia y reducción de grasa para lograr un físico equilibrado y definido.",
        highlight: "El arte del físico."
    },

    {
        title: "Rendimiento Atlético",
        Icon: Dumbbell,
        desc: "Optimización de las capacidades físicas para atletas de todas las disciplinas. Aplicamos periodización táctica para llevar tu rendimiento al siguiente nivel.",
        highlight: "Forja tu ventaja competitiva."
    },
    {
        title: "Longevidad & Vitalidad",
        Icon: HeartPulse,
        desc: "Preservación de la masa muscular y autonomía funcional. Diseñado para adultos mayores que buscan calidad de vida y fuerza.",
        highlight: "Salud sin fecha de caducidad."
    },
    {
        title: "Readaptación Deportiva",
        Icon: Stethoscope,
        desc: "Recuperación de la funcionalidad y prevención de futuras molestias. Protocolos clínicos para blindar tu cuerpo tras una lesión.",
        highlight: "Reconstruye. Fortalece. Vuelve."
    }
];

export const ServicesSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
    };

    // Auto-play effect
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [isPaused, activeIndex]);

    // Calculate class for each card
    const getCardClass = (index: number) => {
        if (index === activeIndex) return styles.active;

        const nextIndex = (activeIndex + 1) % SERVICES.length;
        const prevIndex = (activeIndex - 1 + SERVICES.length) % SERVICES.length;

        if (index === nextIndex) return styles.next;
        if (index === prevIndex) return styles.prev;

        return styles.hidden;
    };

    // Touch Handlers for Mobile Swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        setIsPaused(false);
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextSlide();
        } else if (isRightSwipe) {
            prevSlide();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <section id="services" className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <RevealWrapper>
                        <h2 className={styles.title}>Programas Especializados</h2>
                        <p className={styles.subtitle}>
                            Ciencia aplicada a tus objetivos específicos. Elige tu camino.
                        </p>
                    </RevealWrapper>
                </div>

                <div
                    className={styles.carouselContainer}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {SERVICES.map((s, i) => (
                        <div
                            key={i}
                            className={`${styles.card} ${getCardClass(i)}`}
                            onClick={() => {
                                // Allow clicking side cards to navigate to them
                                if (getCardClass(i) === styles.next) nextSlide();
                                if (getCardClass(i) === styles.prev) prevSlide();
                            }}
                        >
                            <div className={styles.cardIcon}>
                                <s.Icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className={styles.cardTitle}>{s.title}</h3>
                            <p className={styles.cardDesc}>
                                {s.desc}
                            </p>
                            <span className={styles.highlight}>{s.highlight}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
