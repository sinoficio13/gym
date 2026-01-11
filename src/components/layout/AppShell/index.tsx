'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './AppShell.module.css';

// Icons
const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const CalendarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const UserProfile = () => {
    const [user, setUser] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (!user) return null;

    const avatarUrl = user.user_metadata?.avatar_url;
    const fullName = user.user_metadata?.full_name || 'Usuario';
    const email = user.email;

    return (
        <div style={{ marginTop: 'auto', position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    color: 'white',
                    textAlign: 'left',
                    transition: 'background 0.2s'
                }}
                className={styles.userProfileButton}
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {fullName[0]}
                    </div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {fullName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {email}
                    </div>
                </div>
                {/* Chevron */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close click outside */}
                    <div
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '120%', /* Shows above the button */
                        left: 0,
                        width: '100%',
                        background: '#1e1e2d',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '8px',
                        zIndex: 10,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '12px',
                                color: '#ff6b6b',
                                background: 'rgba(255, 59, 48, 0.05)',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

interface NavItemProps {
    href: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    mobile?: boolean;
}

const NavItem = ({ href, label, icon, isActive, mobile }: NavItemProps) => {
    if (mobile) {
        return (
            <Link href={href} className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}>
                <div>{icon}</div>
                <span>{label}</span>
            </Link>
        );
    }
    return (
        <Link href={href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
};

interface AppShellProps {
    children: React.ReactNode;
    navItems: { href: string; label: string; icon: React.ReactNode }[];
    title?: string;
    subtitle?: string;
}

export const AppShell = ({
    children,
    navItems,
    title = 'Eucaris Pereira',
    subtitle = 'Portal de Cliente'
}: AppShellProps) => {
    const pathname = usePathname();

    return (
        <div className={styles.shell}>
            {/* Desktop Sidebar */}
            <aside className={styles.sidebar}>
                <div>
                    <div className={styles.logo}>{title}</div>
                    <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{subtitle}</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </nav>

                {/* User Profile with Dropdown */}
                <UserProfile />
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className={styles.bottomNav}>
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        isActive={pathname === item.href}
                        mobile
                    />
                ))}
            </nav>
        </div>
    );
};
