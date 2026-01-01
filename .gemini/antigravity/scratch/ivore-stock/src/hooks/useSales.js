import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSales() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Get session
        supabase.auth.getSession().then(({ data: { session: authSession } }) => {
            if (authSession?.user) {
                fetchUserProfile(authSession.user.id).then(profile => {
                    setSession({
                        id: authSession.user.id,
                        username: profile?.username,
                        role: profile?.role
                    });
                });
            }
        });

        // Fetch sales
        fetchSales();

        // Subscribe to realtime changes
        const subscription = supabase
            .channel('sales_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'sales' },
                () => {
                    fetchSales();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        return data;
    };

    const fetchSales = async () => {
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('date', { ascending: false });

        if (!error) {
            setSales(data || []);
        }
        setLoading(false);
    };

    const addSale = async (saleData) => {
        try {
            // Decrease stock for each item
            for (const item of saleData.items) {
                const { data: product } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.productId)
                    .single();

                if (product) {
                    await supabase
                        .from('products')
                        .update({ stock: product.stock - item.quantity })
                        .eq('id', item.productId);
                }
            }

            // Add sale
            const { error: saleError } = await supabase
                .from('sales')
                .insert({
                    ...saleData,
                    user_id: session?.id,
                    username: session?.username
                });

            if (saleError) throw saleError;

            // Add log
            await supabase
                .from('logs')
                .insert({
                    user_id: session?.id,
                    username: session?.username,
                    action: `Vente effectuée: ${saleData.total} FCFA`
                });

        } catch (error) {
            console.error('Error adding sale:', error);
            throw error;
        }
    };

    return { sales, loading, addSale };
}
