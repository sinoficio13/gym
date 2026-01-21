'use client';

import { useEffect, useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';
import styles from './FloatingActions.module.css';
import { toast } from 'sonner';

export const FloatingActions = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        // PWA Install Prompt Listener
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleShare = async () => {
        const shareData = {
            title: 'Euscaris Pereira | Entrenadora Personal',
            text: 'Descubre tu máximo potencial. Entrenamiento de alto rendimiento.',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setHasCopied(true);
                toast.success("Enlace copiado al portapapeles");
                setTimeout(() => setHasCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstalled(true);
        }
    };

    // If installed and no share capability (desktop fallback usually works though), maybe hide?
    // But we always show Share. Install only shows if prompt available and not installed.

    return (
        <div className={styles.container}>
            {deferredPrompt && !isInstalled && (
                <button
                    className={styles.button}
                    onClick={handleInstall}
                    data-tooltip="Instalar App"
                    aria-label="Instalar Aplicación"
                >
                    <Download className={styles.icon} />
                </button>
            )}

            <button
                className={styles.button}
                onClick={handleShare}
                data-tooltip={hasCopied ? "Copiado!" : "Compartir Web"}
                aria-label="Compartir"
            >
                {hasCopied ? <Check className={styles.icon} /> : <Share2 className={styles.icon} />}
            </button>
        </div>
    );
};
