import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useSales } from '../hooks/useSales';
import POSProductGrid from '../components/POSProductGrid';
import POSCart from '../components/POSCart';
import CheckoutModal from '../components/CheckoutModal';
import Receipt from '../components/Receipt';

const POS = () => {
    const { products } = useInventory();
    const { addSale } = useSales();

    const [cart, setCart] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);

    // Cart Management
    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // Check global stock limit
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, newQty) => {
        if (newQty < 1) {
            removeFromCart(id);
            return;
        }
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQty } : item
        ));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    // Checkout Logic
    const [lastSale, setLastSale] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    const handleCheckout = async (paymentDetails) => {
        const saleData = {
            date: new Date(),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            ...paymentDetails,
            changeGiven: paymentDetails.change || 0,
            receivedAmount: paymentDetails.receivedAmount || 0
        };

        await addSale(saleData);
        setLastSale(saleData);
        setCart([]);
        setShowCheckout(false);
        setShowReceipt(true);
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex h-[calc(100vh-theme(spacing.32))] md:h-[calc(100vh-theme(spacing.16))] -m-4 md:-m-8">
            {/* Left: Product Grid */}
            <div className="flex-1 overflow-hidden">
                <POSProductGrid
                    products={products || []}
                    onAddToCart={addToCart}
                />
            </div>

            {/* Right: Cart */}
            <div className="w-full md:w-96">
                <POSCart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                    onCheckout={() => setShowCheckout(true)}
                />
            </div>

            {/* Checkout Modal */}
            {showCheckout && (
                <CheckoutModal
                    total={total}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={handleCheckout}
                />
            )}
        </div>
    );
};

export default POS;
