import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { useSales } from '../hooks/useSales';
import POSProductGrid from '../components/POSProductGrid';
import POSCart from '../components/POSCart';
import CheckoutModal from '../components/CheckoutModal';

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
            ...paymentDetails
        };

        await addSale(saleData);
        setCart([]);
        setShowCheckout(false);
        // Optional: Show success toast/receipt
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex h-[calc(100vh-theme(spacing.32))] md:h-[calc(100vh-theme(spacing.16))] -m-4 md:-m-8">
            {/* Left: Product Grid */}
            <div className="w-full md:w-2/3 lg:w-3/4 border-r border-gray-200">
                <POSProductGrid products={products} onAddToCart={addToCart} />
            </div>

            {/* Right: Cart (Hidden on mobile, usable via drawer/toggle - for now stack on mobile via simple responsive design, but let's stick to split view for tablet/desk, and overlay for phone??) 
          Let's make it side-by-side on large screens, and standard flex-col on mobile?
          The layout creates a split. On mobile, we might want the cart to be a bottom sheet or separate tab.
          For simplicity in this step, I'll use standard grid responsive.
      */}
            <div className="hidden md:block w-1/3 lg:w-1/4 bg-white">
                <POSCart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                    onCheckout={() => setShowCheckout(true)}
                />
            </div>

            {/* Mobile Cart Floating Action (if needed) or simple toggle. 
          For now, I'll stick to Desktop-first responsive.
      */}

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
