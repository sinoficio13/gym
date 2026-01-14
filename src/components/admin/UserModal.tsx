'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: string;
    alias: string;
    subscription_status: 'active' | 'inactive' | 'pending';
    subscription_plan: string;
    subscription_expiry?: string;
    avatar_url?: string;
}

interface UserModalProps {
    user: Profile;
    onClose: () => void;
    onUpdate: () => void;
}

export const UserModal = ({ user, onClose, onUpdate }: UserModalProps) => {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    // Form States
    const [fullName, setFullName] = useState(user.full_name || '');
    const [alias, setAlias] = useState(user.alias || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [status, setStatus] = useState(user.subscription_status || 'pending');
    const [plan, setPlan] = useState(user.subscription_plan || 'Basic');
    const [expiry, setExpiry] = useState(user.subscription_expiry || '');
    const [role, setRole] = useState(user.role || 'user');

    const handleSave = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    alias: alias,
                    phone: phone,
                    subscription_status: status,
                    subscription_plan: plan,
                    subscription_expiry: expiry || null,
                    role: role
                })
                .eq('id', user.id);

            if (error) throw error;

            onUpdate();
            onClose();
        } catch (error: any) {
            alert('Error al actualizar usuario: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px' }}>
                <GlassCard style={{ background: 'var(--premium-gradient-surface)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Editar Cliente</h2>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                    </div>

                    {/* Avatar & Email (Read only mostly) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#667eea', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', overflow: 'hidden' }}>
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                (fullName[0] || user.email[0] || 'U').toUpperCase()
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Email (No editable)</div>
                            <div style={{ fontWeight: '500', color: 'white' }}>{user.email}</div>
                        </div>
                    </div>

                    {/* Form Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#d0bcff', marginBottom: '8px' }}>Nombre Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Alias (Apodo)</label>
                            <input
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Teléfono</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Estado Suscripción</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                style={inputStyle}
                            >
                                <option value="active">🟢 Activo</option>
                                <option value="inactive">🔴 Inactivo (Vencido)</option>
                                <option value="pending">🟡 Pendiente de Pago</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Plan</label>
                            <select
                                value={plan}
                                onChange={(e) => setPlan(e.target.value)}
                                style={inputStyle}
                            >
                                <option value="Free">Gratuito / Sin Plan</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Trimestral">Trimestral</option>
                                <option value="Semestral">Semestral</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '8px' }}>Fecha Vencimiento</label>
                            <input
                                type="date"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#ef4444', marginBottom: '8px' }}>Rol de Sistema (Cuidado)</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ ...inputStyle, borderColor: '#ef4444' }}
                            >
                                <option value="user">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <PrimaryButton onClick={handleSave} disabled={loading} fullWidth>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </PrimaryButton>
                </GlassCard>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '8px',
    fontFamily: 'inherit',
    outline: 'none'
};
