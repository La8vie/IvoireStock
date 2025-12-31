import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { TrendingUp, Package, Banknote, History, X, Calendar, TrendingDown } from 'lucide-react';

const UserStats = ({ user, onClose }) => {
    const userSales = useLiveQuery(() =>
        db.sales.where('userId').equals(user.id).toArray()
    ) || [];

    // Helper functions for date calculations
    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const getMonthStart = (date) => {
        const d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth(), 1);
    };

    const now = new Date();
    const thisWeekStart = getWeekStart(now);
    const thisMonthStart = getMonthStart(now);

    // Filter sales by period
    const thisWeekSales = userSales.filter(s => new Date(s.date) >= thisWeekStart);
    const thisMonthSales = userSales.filter(s => new Date(s.date) >= thisMonthStart);

    // Calculate stats
    const stats = {
        totalRevenue: userSales.reduce((sum, s) => sum + (s.total || 0), 0),
        totalSales: userSales.length,
        totalChange: userSales.reduce((sum, s) => sum + (s.changeGiven || 0), 0),
        totalItems: userSales.reduce((sum, s) =>
            sum + s.items.reduce((iSum, item) => iSum + item.quantity, 0), 0
        ),
        weekRevenue: thisWeekSales.reduce((sum, s) => sum + (s.total || 0), 0),
        monthRevenue: thisMonthSales.reduce((sum, s) => sum + (s.total || 0), 0),
    };

    // Group sales by month for historical view
    const salesByMonth = userSales.reduce((acc, sale) => {
        const monthKey = new Date(sale.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        if (!acc[monthKey]) acc[monthKey] = 0;
        acc[monthKey] += sale.total || 0;
        return acc;
    }, {});

    const monthlyData = Object.entries(salesByMonth)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .slice(0, 6);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="p-8 bg-primary text-white flex justify-between items-start sticky top-0 z-10">
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
                            <p className="text-xs font-bold text-gray-400 uppercase">Recette Totale</p>
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

                    {/* Performance Period Breakdown */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            Performance par Période
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-3xl border border-blue-200">
                                <p className="text-xs font-bold text-blue-600 uppercase mb-2">Cette Semaine</p>
                                <p className="text-3xl font-black text-blue-900">{stats.weekRevenue.toLocaleString()}</p>
                                <p className="text-xs text-blue-600 mt-1">FCFA</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-6 rounded-3xl border border-green-200">
                                <p className="text-xs font-bold text-green-600 uppercase mb-2">Ce Mois</p>
                                <p className="text-3xl font-black text-green-900">{stats.monthRevenue.toLocaleString()}</p>
                                <p className="text-xs text-green-600 mt-1">FCFA</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly History Table */}
                    {monthlyData.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 px-2 flex items-center">
                                <TrendingDown className="w-4 h-4 mr-2 text-primary" />
                                Historique Mensuel
                            </h3>
                            <div className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mois</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Recette</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {monthlyData.map(([month, revenue]) => (
                                            <tr key={month} className="hover:bg-white transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">{month}</td>
                                                <td className="px-6 py-4 text-right text-sm font-black text-primary">{revenue.toLocaleString()} FCFA</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

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

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserStats;
