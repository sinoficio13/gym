'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    delay?: number; // Delay in seconds
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

export const RevealWrapper = ({ children, delay = 0, direction = 'up', className = '' }: RevealProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only animate once
            }
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)';
        switch (direction) {
            case 'up': return 'translateY(40px)';
            case 'down': return 'translateY(-40px)';
            case 'left': return 'translateX(40px)';
            case 'right': return 'translateX(-40px)';
            default: return 'translateY(40px)';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
};
