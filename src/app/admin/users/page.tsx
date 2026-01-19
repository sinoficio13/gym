'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRouter } from 'next/navigation';
import styles from './Users.module.css';
import { UserModal } from '@/components/admin/UserModal';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: string;
    alias: string;
    subscription_status: 'activo' | 'inactivo' | 'pendiente' | 'rechazado' | 'vencido';
    subscription_plan: string;
    avatar_url?: string;
    created_at?: string;
}

export default function AdminUsersPage() {
    const supabase = createClient();
    const router = useRouter();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // RLS ensures only admins can see all profiles
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        // Removed order by created_at as column might not exist or be named differently

        if (error) {
            console.error('Error fetching users:', error);
        } else {
            console.log('Usuarios cargados:', data); // Log para verificar
            setUsers(data || []);
        }
        setLoading(false);
    };

    const handleEdit = (userId: string) => {
        const userToEdit = users.find(u => u.id === userId);
        if (userToEdit) {
            setSelectedUser(userToEdit);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.alias || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestión de Clientes</h1>
                <div className={styles.actions}>
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o alias..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className={styles.refreshButton} onClick={fetchUsers}>
                        Actualizar
                    </button>
                </div>
            </div>

            <GlassCard className={styles.tableCard}>
                {loading ? (
                    <div className={styles.loading}>Cargando clientes...</div>
                ) : (
                    <div className={styles.tableResponsive}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre / Alias</th>
                                    <th>Contacto</th>
                                    <th>Suscripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{user.full_name || 'Sin Nombre'}</span>
                                                {user.alias && <span className={styles.userAlias}>({user.alias})</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.contactInfo}>
                                                <span>{user.email}</span>
                                                <span className={styles.phone}>{user.phone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={styles.planBadge}>
                                                {user.subscription_plan ? user.subscription_plan : 'Sin Plan'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[user.subscription_status]}`}>
                                                {user.subscription_status === 'pendiente' ? 'Pendiente de Pago' : user.subscription_status || 'Desconocido'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEdit(user.id)}
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className={styles.emptyState}>No se encontraron usuarios.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>

            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={() => {
                        fetchUsers(); // Refresh list after edit
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}
