import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';

const Receipt = ({ sale, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-6 bg-primary text-white flex justify-between items-center print:hidden">
                    <h2 className="text-2xl font-bold">Reçu de Vente</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Printable Receipt */}
                <div id="receipt-content" className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center border-b-2 border-dashed border-gray-300 pb-4">
                        <h1 className="text-3xl font-black text-primary">IvoireStock</h1>
                        <p className="text-sm text-gray-500 mt-1">Gestion Professionnelle</p>
                        <p className="text-xs text-gray-400 mt-2">
                            {new Date(sale.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Articles</h3>
                        {sale.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.quantity} x {item.price.toLocaleString()} FCFA
                                    </p>
                                </div>
                                <p className="font-bold text-gray-900">
                                    {(item.quantity * item.price).toLocaleString()} FCFA
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 border-t-2 border-gray-300 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Sous-total</span>
                            <span className="font-bold">{sale.total.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-black text-primary">
                            <span>TOTAL</span>
                            <span>{sale.total.toLocaleString()} FCFA</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Mode de paiement</span>
                            <span className="font-bold uppercase">{sale.payment_method || sale.paymentMethod}</span>
                        </div>
                        {sale.receivedAmount && (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Montant reçu</span>
                                    <span className="font-bold">{sale.receivedAmount.toLocaleString()} FCFA</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Monnaie rendue</span>
                                    <span className="font-bold text-green-600">{(sale.changeGiven || sale.change || 0).toLocaleString()} FCFA</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center border-t-2 border-dashed border-gray-300 pt-4 space-y-2">
                        <p className="text-sm text-gray-600">Vendu par : <span className="font-bold">{sale.username}</span></p>
                        <p className="text-xs text-gray-400">Merci pour votre confiance !</p>
                        <p className="text-[10px] text-gray-300 mt-4">IvoireStock v2.0.0 - Powered by Supabase</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex space-x-3 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center"
                    >
                        <Printer className="w-5 h-5 mr-2" />
                        Imprimer
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #receipt-content, #receipt-content * {
                        visibility: visible;
                    }
                    #receipt-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Receipt;
