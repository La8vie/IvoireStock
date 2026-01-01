import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Fetch user profile
                fetchUserProfile(session.user.id).then(profile => {
                    setSession({
                        id: session.user.id,
                        username: profile?.username || session.user.email,
                        role: profile?.role || 'employee',
                        permissions: profile?.permissions || ['pos']
                    });
                    setLoading(false);
                });
            } else {
                setSession(null);
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id);
                setSession({
                    id: session.user.id,
                    username: profile?.username || session.user.email,
                    role: profile?.role || 'employee',
                    permissions: profile?.permissions || ['pos']
                });
            } else {
                setSession(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    };

    const login = async (username, password) => {
        try {
            // For now, we'll use email-based auth with username as email
            // In production, you might want to use a custom auth flow
            const email = `${username}@ivoirestock.local`;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            const profile = await fetchUserProfile(data.user.id);
            return {
                success: true,
                user: {
                    id: data.user.id,
                    username: profile?.username || username,
                    role: profile?.role || 'employee',
                    permissions: profile?.permissions || ['pos']
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.message };
        }
    };

    const signup = async (username, password, inviteCode) => {
        try {
            // Verify invite code
            const { data: invite, error: inviteError } = await supabase
                .from('invites')
                .select('*')
                .eq('code', inviteCode)
                .eq('status', 'active')
                .single();

            if (inviteError || !invite) {
                return { success: false, message: 'Code d\'invitation invalide' };
            }

            // Create auth user
            const email = `${username}@ivoirestock.local`;
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            // Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    username,
                    role: invite.role,
                    permissions: invite.permissions
                });

            if (profileError) throw profileError;

            // Mark invite as used
            await supabase
                .from('invites')
                .update({ status: 'used' })
                .eq('code', inviteCode);

            return { success: true };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    const isAdmin = session?.role === 'admin';

    return {
        session,
        loading,
        login,
        signup,
        logout,
        isAdmin
    };
}
