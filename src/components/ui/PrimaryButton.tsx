import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className = '', fullWidth = false, ...props }) => {
    // Use local style or utility class for fullWidth
    const widthClass = fullWidth ? 'w-full' : '';
    return (
        <button className={`glass-button ${widthClass} ${className}`} {...props}>
            {children}
        </button>
    );
};
