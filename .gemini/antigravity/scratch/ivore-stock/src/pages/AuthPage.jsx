import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Key, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthPage = () => {
    const { login, signup, session } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isAdminSetup, setIsAdminSetup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (session) {
            navigate(session.role === 'admin' ? '/' : '/pos');
        }
    }, [session, navigate]);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        inviteCode: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const checkUsers = async () => {
            const { count } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (count === 0) {
                setIsAdminSetup(true);
                setIsLogin(false);
            }
        };
        checkUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const username = formData.username.trim();
        const password = formData.password.trim();

        if (!username || !password) {
            setIsSubmitting(false);
            return setError('Veuillez remplir tous les champs.');
        }

        try {
            if (isLogin) {
                const res = await login(username, password);
                if (!res.success) setError(res.message);
            } else {
                const res = await signup(
                    username,
                    password,
                    isAdminSetup ? null : formData.inviteCode
                );
                if (res.success) {
                    setIsLogin(true);
                    setIsAdminSetup(false);
                    setFormData({ username: '', password: '', inviteCode: '' });
                    alert('Inscription réussie ! Connectez-vous maintenant.');
                } else {
                    setError(res.message);
                }
            }
        } catch (err) {
            setError('Une erreur technique est survenue.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans flex-col space-y-6">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300">
                <div className="bg-primary p-10 text-white text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full -ml-12 -mb-12 blur-xl"></div>

                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
                        <ShieldCheck className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">IvoireStock</h1>
                    <p className="text-white/80 mt-2 font-medium">
                        {isAdminSetup ? 'Première Configuration' : isLogin ? 'Connexion Sécurisée' : 'Nouveau Compte'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center font-medium animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Nom d'utilisateur</label>
                            <div className="relative group-focus-within:scale-[1.02] transition-transform">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 font-medium"
                                    placeholder="Ex: patrick225"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Mot de passe</label>
                            <div className="relative group-focus-within:scale-[1.02] transition-transform">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!isLogin && !isAdminSetup && (
                            <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Code d'Invitation</label>
                                <div className="relative group-focus-within:scale-[1.02] transition-transform">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.inviteCode}
                                        onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-gray-900 font-medium"
                                        placeholder="Code reçu par l'admin"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            isAdminSetup ? 'Initialiser mon Application' : isLogin ? 'Se Connecter' : 'Créer mon Compte'
                        )}
                    </button>

                    {!isAdminSetup && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors inline-flex items-center"
                            >
                                {isLogin ? (
                                    <>Pas encore de compte ? <span className="text-primary ml-1">S'inscrire</span></>
                                ) : (
                                    <>Déjà inscrit ? <span className="text-primary ml-1">Se connecter</span></>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>

            <div className="flex flex-col items-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[10px] text-gray-400">IvoireStock v2.0.0 - Synchronisation Temps Réel</p>
            </div>
        </div>
    );
};

export default AuthPage;
