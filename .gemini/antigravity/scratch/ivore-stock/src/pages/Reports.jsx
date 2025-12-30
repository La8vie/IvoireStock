import React from 'react';
import { useSales } from '../hooks/useSales';
import { exportToExcel } from '../utils/excel';
import { FileDown } from 'lucide-react';

const Reports = () => {
    const { sales } = useSales();

    const handleExport = () => {
        if (!sales) return;

        // Format data for export
        const dataToExport = sales.map(sale => ({
            ID: sale.id,
            Date: new Date(sale.date).toLocaleString(),
            Total: sale.total,
            'Mode de Paiement': sale.paymentMethod,
            'Articles': sale.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
        }));

        exportToExcel(dataToExport, `Raport_Ventes_${new Date().toISOString().split('T')[0]}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Rapports & Ventes</h1>
                <button
                    onClick={handleExport}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <FileDown className="w-5 h-5 mr-2" />
                    Exporter Excel
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales?.map(sale => (
                            <tr key={sale.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="max-w-xs truncate">
                                        {sale.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                     ${sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                                            sale.paymentMethod === 'wave' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {sale.paymentMethod}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                    {sale.total.toLocaleString()} F
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!sales || sales.length === 0) && (
                    <div className="p-12 text-center text-gray-500">Aucune vente enregistrée.</div>
                )}
            </div>
        </div>
    );
};

export default Reports;
