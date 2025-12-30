import React from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

const POSCart = ({ cart, onUpdateQuantity, onRemove, onClear, onCheckout }) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-lg flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Panier ({cart.length})
                </h2>
                <button
                    onClick={onClear}
                    disabled={cart.length === 0}
                    className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
                >
                    Vider
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                        <p>Panier vide</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-500">{item.price.toLocaleString()} F x {item.quantity}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-gray-100 rounded-l"
                                    >
                                        <Minus className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-gray-100 rounded-r"
                                        disabled={item.quantity >= item.stock}
                                    >
                                        <Plus className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <p className="font-bold w-16 text-right">
                                    {(item.price * item.quantity).toLocaleString()}
                                </p>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-lg text-gray-600">Total</span>
                    <span className="text-3xl font-bold text-primary">{total.toLocaleString()} F</span>
                </div>
                <button
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                    className="w-full py-4 bg-primary text-white rounded-xl shadow-lg font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                    Encaisser
                </button>
            </div>
        </div>
    );
};

export default POSCart;
