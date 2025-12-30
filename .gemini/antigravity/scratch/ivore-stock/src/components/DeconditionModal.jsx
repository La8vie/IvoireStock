import React, { useState } from 'react';
import { RefreshCcw, ArrowDown, Package, Layers, X } from 'lucide-react';

const DeconditionModal = ({ products, onConvert, onClose }) => {
    const [sourceId, setSourceId] = useState('');
    const [targetId, setTargetId] = useState('');
    const [sourceQty, setSourceQty] = useState(1);
    const [conversionRate, setConversionRate] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!sourceId || !targetId) return alert('Veuillez sélectionner les deux produits');
        if (sourceId === targetId) return alert('Le produit source et cible doivent être différents');

        onConvert(parseInt(sourceId), parseInt(targetId), parseInt(sourceQty), parseInt(conversionRate));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 bg-primary text-white flex justify-between items-center">
                    <div className="flex items-center">
                        <RefreshCcw className="w-5 h-5 mr-3" />
                        <h2 className="text-xl font-bold">Déconditionnement (Gros → Détail)</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Source (Gros) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase flex items-center">
                            <Package className="w-3 h-3 mr-2 text-primary" /> Produit Source (Gros / Carton)
                        </label>
                        <select
                            value={sourceId}
                            onChange={(e) => setSourceId(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            required
                        >
                            <option value="">Sélectionner le carton/sac...</option>
                            {products.filter(p => p.stock > 0).map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} (Stock: {p.stock})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center -my-3">
                        <div className="bg-gray-100 p-2 rounded-full border-4 border-white">
                            <ArrowDown className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Target (Détail) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase flex items-center">
                            <Layers className="w-3 h-3 mr-2 text-primary" /> Produit Cible (Détail / Unité)
                        </label>
                        <select
                            value={targetId}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            required
                        >
                            <option value="">Sélectionner l'article de vente...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Qté à déconditionner</label>
                            <input
                                type="number"
                                min="1"
                                value={sourceQty}
                                onChange={(e) => setSourceQty(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Unités par carton</label>
                            <input
                                type="number"
                                min="1"
                                value={conversionRate}
                                onChange={(e) => setConversionRate(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                        <p className="text-xs text-blue-700 font-medium">
                            Cette action va retirer <span className="font-bold">{sourceQty}</span> du produit source et ajouter <span className="font-bold">{sourceQty * conversionRate}</span> au produit cible.
                        </p>
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Confirmer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeconditionModal;
