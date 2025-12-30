import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import DeconditionModal from '../components/DeconditionModal';
import { Plus, RefreshCcw } from 'lucide-react';

const Inventory = () => {
    const { products, addProduct, updateProduct, deleteProduct, convertStock } = useInventory();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isConvertOpen, setIsConvertOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const handleSave = async (data) => {
        let res;
        if (editingProduct) {
            res = await updateProduct(editingProduct.id, data);
        } else {
            res = await addProduct(data);
        }

        if (res.message) alert(res.message);

        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
            const res = await deleteProduct(id);
            if (res.message) alert(res.message);
        }
    };

    const handleConvert = async (sourceId, targetId, qty, rate) => {
        const res = await convertStock(sourceId, targetId, qty, rate);
        if (res.message) alert(res.message);
        setIsConvertOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
                <div className="flex space-x-2">
                    {!isFormOpen && (
                        <>
                            <button
                                onClick={() => setIsConvertOpen(true)}
                                className="flex items-center px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg shadow-sm hover:bg-amber-100 transition-colors"
                            >
                                <RefreshCcw className="w-5 h-5 mr-2" />
                                Convertir (Gros/Détail)
                            </button>
                            <button
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsFormOpen(true);
                                }}
                                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nouveau Produit
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isConvertOpen && (
                <DeconditionModal
                    products={products || []}
                    onClose={() => setIsConvertOpen(false)}
                    onConvert={handleConvert}
                />
            )}

            {isFormOpen ? (
                <ProductForm
                    onSave={handleSave}
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingProduct(null);
                    }}
                    initialData={editingProduct || {}}
                />
            ) : (
                <ProductList
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default Inventory;
