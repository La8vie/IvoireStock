import React from 'react';
import { useSales } from '../hooks/useSales';
import { useInventory } from '../hooks/useInventory';
import { DollarSign, ShoppingBag, AlertCircle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { sales } = useSales();
    const { products } = useInventory();

    // Metrics Calculation
    const today = new Date().toDateString();
    const salesToday = sales?.filter(s => new Date(s.date).toDateString() === today) || [];

    const revenueToday = salesToday.reduce((sum, sale) => sum + sale.total, 0);
    const revenueTotal = sales?.reduce((sum, sale) => sum + sale.total, 0) || 0;

    const lowStockCount = products?.filter(p => p.stock <= p.minStock).length || 0;

    const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Ventes Aujourd'hui"
                    value={`${revenueToday.toLocaleString()} F`}
                    icon={DollarSign}
                    color="bg-emerald-500"
                    subtext={`${salesToday.length} transactions`}
                />
                <StatCard
                    title="Commandes (Total)"
                    value={sales?.length || 0}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Chiffre d'Affaires Total"
                    value={`${revenueTotal.toLocaleString()} F`}
                    icon={TrendingUp}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Stock Faible"
                    value={lowStockCount}
                    icon={AlertCircle}
                    color={lowStockCount > 0 ? "bg-red-500" : "bg-gray-400"}
                    subtext="Produits à réapprovisionner"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Dernières Ventes</h3>
                    <div className="space-y-3">
                        {sales?.slice(0, 5).map(sale => (
                            <div key={sale.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="font-medium text-sm text-gray-900">
                                        {sale.items.length} articles
                                    </p>
                                    <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleTimeString()}</p>
                                </div>
                                <span className="font-bold text-primary">{sale.total.toLocaleString()} F</span>
                            </div>
                        ))}
                        {(!sales || sales.length === 0) && <p className="text-sm text-gray-500">Aucune vente récente</p>}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4">Produits Populaires</h3>
                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-lg">
                        Graphique à venir...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
