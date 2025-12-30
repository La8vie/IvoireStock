import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useInventory() {
    const products = useLiveQuery(() => db.products.toArray());
    const session = JSON.parse(localStorage.getItem('ivoire_stock_session'));
    const isAdmin = session?.role === 'admin';

    const createRequest = async (type, data) => {
        return await db.requests.add({
            type,
            data,
            userId: session.id,
            username: session.username,
            timestamp: new Date(),
            status: 'pending'
        });
    };

    const addProduct = async (product) => {
        if (isAdmin) {
            const id = await db.products.add(product);
            await db.logs.add({
                userId: session.id,
                username: session.username,
                action: `Ajout produit (Direct): ${product.name}`,
                timestamp: new Date()
            });
            return { success: true, id };
        } else {
            await createRequest('ADD_PRODUCT', product);
            return { success: false, message: 'Demande d\'ajout envoyée à l\'admin' };
        }
    };

    const updateProduct = async (id, updates) => {
        if (isAdmin) {
            await db.products.update(id, updates);
            return { success: true };
        } else {
            await createRequest('EDIT_PRODUCT', { id, ...updates });
            return { success: false, message: 'Demande de modification envoyée' };
        }
    };

    const deleteProduct = async (id) => {
        if (isAdmin) {
            await db.products.delete(id);
            return { success: true };
        } else {
            const product = await db.products.get(id);
            await createRequest('DELETE_PRODUCT', { id, name: product?.name });
            return { success: false, message: 'Demande de suppression envoyée' };
        }
    };

    const convertStock = async (sourceId, targetId, sourceQty, conversionRate) => {
        const source = await db.products.get(sourceId);
        const target = await db.products.get(targetId);

        if (!source || !target) return { success: false, message: 'Produit introuvable' };
        if (source.stock < sourceQty) return { success: false, message: 'Stock insuffisant pour le produit source' };

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
            await db.products.update(sourceId, { stock: source.stock - sourceQty });
            await db.products.update(targetId, { stock: target.stock + (sourceQty * conversionRate) });
            await db.logs.add({
                userId: session.id,
                username: session.username,
                action: `Conversion (Direct): ${sourceQty} ${source.name} en ${requestData.totalRetailAdded} ${target.name}`,
                timestamp: new Date()
            });
            return { success: true, message: 'Conversion effectuée avec succès' };
        } else {
            await createRequest('CONVERT_STOCK', requestData);
            return { success: false, message: 'Demande de conversion envoyée à l\'admin' };
        }
    };

    return { products, addProduct, updateProduct, deleteProduct, convertStock };
}
