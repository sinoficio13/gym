'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface CalendarClusterModalProps {
    appointments: any[];
    onClose: () => void;
    onSelectAppointment: (apt: any) => void;
    startTime: Date;
}

export const CalendarClusterModal = ({ appointments, onClose, onSelectAppointment, startTime }: CalendarClusterModalProps) => {

    // Sort slightly by status or name if needed. Currently raw list.
    const sortedAppointments = [...appointments].sort((a, b) => {
        // Confirmed first, then pending
        if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
        if (a.status !== 'confirmed' && b.status === 'confirmed') return 1;
        // Then by name
        const nameA = a.profiles?.full_name || '';
        const nameB = b.profiles?.full_name || '';
        return nameA.localeCompare(nameB);
    });

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100, // Higher than Calendar interactions
            padding: '16px'
        }} onClick={onClose}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '100%',
                maxWidth: '450px',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto' // Center vertically if logic changes
            }}>
                <GlassCard style={{
                    background: 'var(--premium-card-bg, #1a1a2e)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    maxHeight: '60vh', // Reduced to ensure it fits on all screens
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' // Elevation
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '16px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.03)'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>
                                Grupo de {startTime.toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                            </h3>
                            <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
                                {appointments.length} Citas Programadas
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#aaa',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0 8px'
                            }}
                        >
                            &times;
                        </button>
                    </div>

                    {/* List */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '12px',
                        paddingBottom: '32px', // Extra padding at bottom for easy scrolling
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {sortedAppointments.map(apt => {
                            const client = apt.profiles || {};
                            const isConfirmed = apt.status === 'confirmed';

                            return (
                                <div
                                    key={apt.id}
                                    onClick={() => onSelectAppointment(apt)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    {/* Avatar / Status Indicator */}
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: '50%',
                                            background: '#333',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            color: '#eee'
                                        }}>
                                            {client.avatar_url ? (
                                                <img src={client.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                client.full_name?.[0] || '?'
                                            )}
                                        </div>
                                        {/* Status Dot */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0, right: 0,
                                            width: 12, height: 12, borderRadius: '50%',
                                            background: isConfirmed ? '#4ade80' : '#fbbf24', // Green or Amber
                                            border: '2px solid #1a1a2e'
                                        }} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {client.full_name || 'Sin Nombre'}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>{formatTime(apt.start_time)} - {formatTime(apt.end_time)}</span>
                                            {client.training_goal && (
                                                <>
                                                    <span>•</span>
                                                    <span style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7em'
                                                    }}>
                                                        {client.training_goal}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Chevron */}
                                    <div style={{ color: '#555' }}>
                                        &rsaquo;
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
