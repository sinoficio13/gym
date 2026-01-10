import Link from 'next/link';
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <div>
        <h1 className={styles.heroTitle}>
          Tu Mejor Versión. <br />
          Sin Excusas.
        </h1>
        <p className={styles.heroSubtitle}>
          Entrenamiento profesional adaptado a tu estilo de vida.
          Gestiona tus horarios y reserva tu sesión en segundos con nuestra plataforma exclusiva.
        </p>
      </div>

      <GlassCard className={styles.ctaGroup}>
        <h2 style={{ fontSize: 'var(--font-size-heading)', margin: 0 }}>
          Empieza Tu Transformación
        </h2>
        <div className={styles.buttonGroup}>
          <Link href="/booking">
            <PrimaryButton>Agendar Entrenamiento</PrimaryButton>
          </Link>
          <Link href="/services">
            <button className={styles.secondaryButton}>
              Ver Planes
            </button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
