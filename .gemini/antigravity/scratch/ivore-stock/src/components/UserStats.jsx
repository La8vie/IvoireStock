import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { TrendingUp, Package, Banknote, History, X } from 'lucide-react';

const UserStats = ({ user, onClose }) => {
    const userSales = useLiveQuery(() =>
        db.sales.where('userId').equals(user.id).toArray()
    ) || [];

    const stats = {
        totalRevenue: userSales.reduce((sum, s) => sum + (s.total || 0), 0),
        totalSales: userSales.length,
        totalChange: userSales.reduce((sum, s) => sum + (s.changeGiven || 0), 0),
        totalItems: userSales.reduce((sum, s) =>
            sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0), 0
        )
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-8 bg-primary text-white flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">Statistiques de Performance</p>
                        <h2 className="text-3xl font-black">{user.username}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <Banknote className="w-8 h-8 text-green-500 mb-4" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Recette Générée</p>
                            <p className="text-2xl font-black text-gray-900">{stats.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-400">FCFA</span></p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <TrendingUp className="w-8 h-8 text-blue-500 mb-4" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Nombre de Ventes</p>
                            <p className="text-2xl font-black text-gray-900">{stats.totalSales}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <Package className="w-8 h-8 text-amber-500 mb-4" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Stock Écoulé</p>
                            <p className="text-2xl font-black text-gray-900">{stats.totalItems} <span className="text-sm font-normal text-gray-400">articles</span></p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <History className="w-8 h-8 text-red-500 mb-4" />
                            <p className="text-xs font-bold text-gray-400 uppercase">Monnaie Rendue</p>
                            <p className="text-2xl font-black text-gray-900">{stats.totalChange.toLocaleString()} <span className="text-sm font-normal text-gray-400">FCFA</span></p>
                        </div>
                    </div>

                    {/* Recent Sales List */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2">Dernières ventes</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {userSales.slice(0, 10).map(sale => (
                                <div key={sale.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900">{sale.items.length} article{sale.items.length > 1 ? 's' : ''}</p>
                                        <p className="text-[10px] text-gray-400 font-mono uppercase">{new Date(sale.date).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-primary">{sale.total.toLocaleString()} FCFA</p>
                                        <p className="text-[10px] text-gray-400">{sale.paymentMethod.toUpperCase()}</p>
                                    </div>
                                </div>
                            ))}
                            {userSales.length === 0 && (
                                <div className="text-center py-8 text-gray-400 italic">Aucune vente effectuée pour le moment.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl shadow-sm hover:bg-gray-50 transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserStats;
