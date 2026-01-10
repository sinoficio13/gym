import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', style = {}, hoverEffect = true }) => {
    return (
        <div
            className={`glass-card ${className}`}
            style={style}
        /* Remove hover effect via inline if specific logic needed, otherwise CSS handles it */
        >
            {children}
        </div>
    );
};
