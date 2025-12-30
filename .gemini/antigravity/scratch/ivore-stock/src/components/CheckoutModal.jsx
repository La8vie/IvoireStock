import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const CheckoutModal = ({ total, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [receivedAmount, setReceivedAmount] = useState('');

    const change = receivedAmount ? parseFloat(receivedAmount) - total : 0;
    const isEnough = change >= 0 || paymentMethod !== 'cash';

    const handleConfirm = () => {
        if (!isEnough) return;
        onConfirm({
            paymentMethod,
            receivedAmount: parseFloat(receivedAmount) || total,
            change: change > 0 ? change : 0
        });
    };

    const methods = [
        { id: 'cash', label: 'Espèces', color: 'bg-green-100 text-green-700' },
        { id: 'wave', label: 'Wave', color: 'bg-blue-100 text-blue-700' },
        { id: 'om', label: 'Orange Money', color: 'bg-orange-100 text-orange-700' },
        { id: 'momo', label: 'MTN MoMo', color: 'bg-yellow-100 text-yellow-700' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Paiement</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <span className="text-gray-500 text-sm">Montant Total</span>
                        <p className="text-4xl font-bold text-gray-900">{total.toLocaleString()} FCFA</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mode de Paiement</label>
                        <div className="grid grid-cols-2 gap-3">
                            {methods.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setPaymentMethod(m.id)}
                                    className={`p-3 rounded-lg font-medium transition-all ${paymentMethod === m.id
                                            ? `${m.color} ring-2 ring-offset-1 ring-current`
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {paymentMethod === 'cash' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Montant Reçu</label>
                            <input
                                type="number"
                                value={receivedAmount}
                                onChange={(e) => setReceivedAmount(e.target.value)}
                                className="w-full text-2xl p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="0"
                                autoFocus
                            />
                            <div className={`mt-4 p-4 rounded-lg flex justify-between items-center ${change >= 0 ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
                                }`}>
                                <span className="font-semibold">Monnaie à rendre :</span>
                                <span className="text-xl font-bold">{change >= 0 ? change.toLocaleString() : 'Pas assez'} FCFA</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleConfirm}
                        disabled={!isEnough}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Check className="w-6 h-6 mr-2" />
                        Valider la Vente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
