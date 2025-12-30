import { useState, useEffect } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = localStorage.getItem('ivoire_stock_session');
        if (session) {
            setCurrentUser(JSON.parse(session));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const cleanUser = username?.trim();
        const cleanPass = password?.trim();

        if (!cleanUser || !cleanPass) {
            return { success: false, message: 'Veuillez remplir tous les champs' };
        }

        // Use more robust Dexie query for multiple fields
        const user = await db.users
            .where('username').equals(cleanUser)
            .filter(u => u.password === cleanPass)
            .first();

        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            localStorage.setItem('ivoire_stock_session', JSON.stringify(userWithoutPassword));
            setCurrentUser(userWithoutPassword);
            await addLog(user.id, user.username, 'Connexion');
            return { success: true };
        }
        return { success: false, message: 'Identifiants incorrects' };
    };

    const logout = () => {
        if (currentUser) {
            addLog(currentUser.id, currentUser.username, 'Déconnexion');
        }
        localStorage.removeItem('ivoire_stock_session');
        setCurrentUser(null);
    };

    const register = async (userData, inviteCode = null) => {
        const username = userData.username?.trim();
        const password = userData.password?.trim();

        if (!username || !password) {
            return { success: false, message: 'Nom d\'utilisateur et mot de passe requis' };
        }

        // Check if it's the first user (Admin)
        const userCount = await db.users.count();

        if (userCount === 0) {
            // First user is Admin with all permissions
            const allPermissions = ['dashboard', 'pos', 'inventory', 'reports', 'settings'];
            const id = await db.users.add({ ...userData, username, password, role: 'admin', permissions: allPermissions });
            return { success: true, id };
        }

        // Check invite code
        const cleanInvite = inviteCode?.trim();
        if (!cleanInvite) {
            return { success: false, message: 'Code d\'invitation requis' };
        }

        const invite = await db.invites.where({ code: cleanInvite, status: 'active' }).first();
        if (!invite) {
            return { success: false, message: 'Code d\'invitation invalide ou déjà utilisé' };
        }

        const id = await db.users.add({ ...userData, username, password, role: invite.role, permissions: invite.permissions || [] });
        await db.invites.update(invite.id, { status: 'used' });
        return { success: true, id };
    };

    const addLog = async (userId, username, action) => {
        await db.logs.add({
            userId,
            username,
            action,
            timestamp: new Date()
        });
    };

    return { currentUser, loading, login, logout, register, addLog };
}
