import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { UserPlus, Trash2, Key, ListFilter, Info, Shield, CheckCircle, XCircle } from 'lucide-react';

const Settings = () => {
    const users = useLiveQuery(() => db.users.toArray()) || [];
    const invites = useLiveQuery(() => db.invites.toArray()) || [];
    const logs = useLiveQuery(() => db.logs.orderBy('id').reverse().limit(20).toArray()) || [];
    const pendingRequests = useLiveQuery(() => db.requests.where('status').equals('pending').toArray()) || [];

    const [activeTab, setActiveTab] = useState('users');
    const [selectedPermissions, setSelectedPermissions] = useState(['pos']);

    const availablePermissions = [
        { id: 'dashboard', label: 'Tableau de Bord' },
        { id: 'pos', label: 'Caisse (Vente)' },
        { id: 'inventory', label: 'Stock / Inventaire' },
        { id: 'reports', label: 'Rapports / Factures' },
        { id: 'settings', label: 'Paramètres / Admin' },
    ];

    const handleApprove = async (req) => {
        try {
            if (req.type === 'ADD_PRODUCT') {
                await db.products.add(req.data);
            } else if (req.type === 'EDIT_PRODUCT') {
                const { id, ...updates } = req.data;
                await db.products.update(id, updates);
            } else if (req.type === 'DELETE_PRODUCT') {
                await db.products.delete(req.data.id);
            } else if (req.type === 'CONVERT_STOCK') {
                const { sourceId, targetId, sourceQty, totalRetailAdded } = req.data;
                const source = await db.products.get(sourceId);
                const target = await db.products.get(targetId);
                if (source && target) {
                    await db.products.update(sourceId, { stock: source.stock - sourceQty });
                    await db.products.update(targetId, { stock: target.stock + totalRetailAdded });
                }
            }
            await db.requests.update(req.id, { status: 'approved' });
            await db.logs.add({
                userId: req.userId,
                username: req.username,
                action: `Approuvé par Admin: ${req.type}`,
                timestamp: new Date()
            });
        } catch (err) {
            alert('Erreur lors de l\'approbation');
        }
    };

    const handleReject = async (id) => {
        await db.requests.update(id, { status: 'rejected' });
    };

    const generateInvite = async (role) => {
        const code = `INV-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        await db.invites.add({
            code,
            role,
            status: 'active',
            permissions: selectedPermissions
        });
        alert('Code généré avec succès !');
    };

    const togglePermission = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const toggleUserPermission = async (user, permissionId) => {
        if (user.username === 'admin') return;
        const newPermissions = user.permissions?.includes(permissionId)
            ? user.permissions.filter(p => p !== permissionId)
            : [...(user.permissions || []), permissionId];

        await db.users.update(user.id, { permissions: newPermissions });

        const session = JSON.parse(localStorage.getItem('ivoire_stock_session'));
        if (session && session.id === user.id) {
            localStorage.setItem('ivoire_stock_session', JSON.stringify({ ...session, permissions: newPermissions }));
            window.location.reload();
        }
    };

    const deleteUser = async (id, username) => {
        if (username === 'admin') return alert('Impossible de supprimer le compte admin principal');
        if (window.confirm(`Supprimer l'utilisateur ${username} ?`)) {
            await db.users.delete(id);
        }
    };

    const deleteInvite = async (id) => {
        await db.invites.delete(id);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Paramètres & Administration</h1>

            <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit">
                {['users', 'approvals', 'logs', 'about'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab === 'users' ? 'Utilisateurs' : tab === 'approvals' ? 'Approbations' : tab === 'logs' ? 'Activités' : 'À Propos'}
                        {tab === 'approvals' && pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === 'users' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-primary" /> Equipe & Accès
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {users.map(u => (
                                    <div key={u.id} className="p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-900">{u.username}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">{u.role}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteUser(u.id, u.username)}
                                                className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {u.username !== 'admin' && (
                                            <div className="flex flex-wrap gap-2">
                                                {availablePermissions.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => toggleUserPermission(u, p.id)}
                                                        className={`text-[9px] font-bold px-2 py-1 rounded-full border transition-all ${u.permissions?.includes(p.id)
                                                            ? 'bg-primary/10 border-primary text-primary'
                                                            : 'bg-gray-50 border-gray-100 text-gray-400'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                    <Key className="w-5 h-5 mr-2 text-amber-500" /> Nouvel Employé
                                </h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-3">Donner accès aux branches :</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {availablePermissions.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => togglePermission(p.id)}
                                                className={`flex items-center px-3 py-2 border rounded-xl text-xs font-medium transition-all ${selectedPermissions.includes(p.id)
                                                    ? 'bg-amber-50 border-amber-500 text-amber-700'
                                                    : 'bg-white border-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                <div className={`w-3 h-3 rounded-sm mr-2 border ${selectedPermissions.includes(p.id) ? 'bg-amber-500 border-amber-600' : 'bg-gray-50 border-gray-200'
                                                    }`} />
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => generateInvite('employee')}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                                >
                                    <UserPlus className="w-5 h-5 mr-2" /> Générer Code d'Invitation
                                </button>
                            </div>

                            <div className="p-4 bg-gray-50/50 border-t border-gray-50 space-y-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase px-2 mb-2">Codes Actifs</p>
                                {invites.filter(i => i.status === 'active').map(inv => (
                                    <div key={inv.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-gray-900 tracking-widest">{inv.code}</span>
                                            <span className="text-[8px] text-gray-400">{inv.permissions?.join(', ')}</span>
                                        </div>
                                        <button onClick={() => deleteInvite(inv.id)} className="text-gray-300 hover:text-red-500 p-1">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {invites.filter(i => i.status === 'active').length === 0 && (
                                    <p className="text-center text-xs text-gray-400 py-2 italic font-medium">Aucun code en attente.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'approvals' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 flex items-center">
                            <Info className="w-5 h-5 mr-2 text-primary" /> Demandes en attente
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.type === 'ADD_PRODUCT' ? 'bg-green-100 text-green-700' :
                                            req.type === 'DELETE_PRODUCT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {req.type.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">{req.username}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {req.type === 'DELETE_PRODUCT' ? `Suppression de: ${req.data.name}` :
                                            req.type === 'ADD_PRODUCT' ? `Nouveau produit: ${req.data.name} (${req.data.stock} en stock)` :
                                                req.type === 'CONVERT_STOCK' ? `Conversion: ${req.data.sourceQty} ${req.data.sourceName} → ${req.data.totalRetailAdded} ${req.data.targetName}` :
                                                    `Modification de: ${req.data.name}`}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-mono">{new Date(req.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-3 w-full md:w-auto">
                                    <button
                                        onClick={() => handleReject(req.id)}
                                        className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        Rejeter
                                    </button>
                                    <button
                                        onClick={() => handleApprove(req)}
                                        className="flex-1 md:flex-none px-6 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-center"
                                    >
                                        Approuver
                                    </button>
                                </div>
                            </div>
                        ))}
                        {pendingRequests.length === 0 && (
                            <div className="p-12 text-center text-gray-400 italic">Aucune demande en attente.</div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800 flex items-center">
                            <ListFilter className="w-5 h-5 mr-2 text-blue-500" /> Journal d'activités récentes
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-[10px] uppercase text-gray-400 font-bold">
                                <tr>
                                    <th className="px-6 py-3 text-left">Utilisateur</th>
                                    <th className="px-6 py-3 text-left">Action</th>
                                    <th className="px-6 py-3 text-right">Date & Heure</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map(log => (
                                    <tr key={log.id} className="text-sm">
                                        <td className="px-6 py-4 font-medium text-gray-900">{log.username}</td>
                                        <td className="px-6 py-4 text-gray-600">{log.action}</td>
                                        <td className="px-6 py-4 text-right text-xs text-gray-400 font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr><td colSpan="3" className="p-8 text-center text-gray-400 italic">Aucune activité enregistrée.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'about' && (
                <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center flex flex-col items-center mx-auto">
                    <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 shadow-inner">
                        <Shield className="w-12 h-12 text-primary -rotate-3" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">IvoireStock Pro</h2>
                    <div className="mt-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Version 1.2.0</div>
                    <p className="text-gray-500 mt-6 text-lg leading-relaxed max-w-md">
                        Solution intelligente pour la gestion commerciale en Côte d'Ivoire.
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-6 w-full max-w-sm">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Status</p>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <p className="font-black text-gray-800">Opérationnel</p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 text-left">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Mode</p>
                            <p className="font-black text-gray-800 italic">Offline-First</p>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-100 w-full text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                        Handcrafted with Passion by Antigravity AI
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
