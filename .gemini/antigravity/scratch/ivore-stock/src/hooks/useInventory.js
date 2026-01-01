import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useInventory() {
    const [products, setProducts] = useState([]);
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
                        role: profile?.role,
                        permissions: profile?.permissions
                    });
                });
            }
        });

        // Fetch products
        fetchProducts();

        // Subscribe to realtime changes
        const subscription = supabase
            .channel('products_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                () => {
                    fetchProducts();
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

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('name');

        if (!error) {
            setProducts(data || []);
        }
        setLoading(false);
    };

    const isAdmin = session?.role === 'admin';

    const createRequest = async (type, data) => {
        const { error } = await supabase
            .from('requests')
            .insert({
                type,
                data,
                user_id: session.id,
                username: session.username,
                status: 'pending'
            });

        if (error) {
            console.error('Error creating request:', error);
            throw error;
        }
    };

    const addLog = async (action) => {
        await supabase
            .from('logs')
            .insert({
                user_id: session.id,
                username: session.username,
                action
            });
    };

    const addProduct = async (product) => {
        if (isAdmin) {
            const { data, error } = await supabase
                .from('products')
                .insert(product)
                .select()
                .single();

            if (error) {
                console.error('Error adding product:', error);
                return { success: false, message: error.message };
            }

            await addLog(`Ajout produit (Direct): ${product.name}`);
            return { success: true, id: data.id };
        } else {
            await createRequest('ADD_PRODUCT', product);
            return { success: false, message: 'Demande d\'ajout envoyée à l\'admin' };
        }
    };

    const updateProduct = async (id, updates) => {
        if (isAdmin) {
            const { error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id);

            if (error) {
                console.error('Error updating product:', error);
                return { success: false, message: error.message };
            }

            return { success: true };
        } else {
            await createRequest('EDIT_PRODUCT', { id, ...updates });
            return { success: false, message: 'Demande de modification envoyée' };
        }
    };

    const deleteProduct = async (id) => {
        if (isAdmin) {
            // Get product name first
            const { data: product } = await supabase
                .from('products')
                .select('name')
                .eq('id', id)
                .single();

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting product:', error);
                return { success: false, message: error.message };
            }

            await addLog(`Suppression produit: ${product?.name}`);
            return { success: true };
        } else {
            const { data: product } = await supabase
                .from('products')
                .select('name')
                .eq('id', id)
                .single();

            await createRequest('DELETE_PRODUCT', { id, name: product?.name });
            return { success: false, message: 'Demande de suppression envoyée' };
        }
    };

    const convertStock = async (sourceId, targetId, sourceQty, conversionRate) => {
        // Fetch both products
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .in('id', [sourceId, targetId]);

        const source = products?.find(p => p.id === sourceId);
        const target = products?.find(p => p.id === targetId);

        if (!source || !target) {
            return { success: false, message: 'Produit introuvable' };
        }

        if (source.stock < sourceQty) {
            return { success: false, message: 'Stock insuffisant pour le produit source' };
        }

        const requestData = {
            sourceId,
            targetId,
            sourceName: source.name,
            targetName: target.name,
            sourceQty,
            conversionRate,
            totalRetailAdded: sourceQty * conversionRate
        };

        if (isAdmin) {
            // Update both products
            await supabase
                .from('products')
                .update({ stock: source.stock - sourceQty })
                .eq('id', sourceId);

            await supabase
                .from('products')
                .update({ stock: target.stock + (sourceQty * conversionRate) })
                .eq('id', targetId);

            await addLog(`Conversion (Direct): ${sourceQty} ${source.name} en ${requestData.totalRetailAdded} ${target.name}`);
            return { success: true, message: 'Conversion effectuée avec succès' };
        } else {
            await createRequest('CONVERT_STOCK', requestData);
            return { success: false, message: 'Demande de conversion envoyée à l\'admin' };
        }
    };

    return { products, loading, addProduct, updateProduct, deleteProduct, convertStock };
}
