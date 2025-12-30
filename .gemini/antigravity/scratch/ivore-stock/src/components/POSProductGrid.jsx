import React, { useState } from 'react';
import { Search } from 'lucide-react';

const POSProductGrid = ({ products, onAddToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(products?.map(p => p.category) || [])];

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchTerm));
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    return (
        <div className="flex flex-col h-full bg-gray-50 p-4">
            {/* Search & Filter */}
            <div className="mb-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Chercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                    ? 'bg-gray-800 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20 md:pb-0">
                {filteredProducts.map(product => (
                    <button
                        key={product.id}
                        onClick={() => onAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between text-left transition-transform hover:scale-105 active:scale-95 ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'
                            }`}
                    >
                        <div>
                            <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                        </div>
                        <div className="mt-3 flex justify-between items-end">
                            <span className="font-bold text-primary">{product.price.toLocaleString()} F</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${product.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {product.stock}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default POSProductGrid;
