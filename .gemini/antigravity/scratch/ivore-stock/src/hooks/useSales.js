import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useSales() {
    const sales = useLiveQuery(() => db.sales.orderBy('date').reverse().toArray());

    const addSale = async (saleData) => {
        // saleData should include: { items: [], total: 0, paymentMethod: 'cash', date: new Date() }

        // Decrease stock for each item
        await db.transaction('rw', db.products, db.sales, db.logs, async () => {
            for (const item of saleData.items) {
                const product = await db.products.get(item.productId);
                if (product) {
                    await db.products.update(item.productId, { stock: product.stock - item.quantity });
                }
            }
            const session = JSON.parse(localStorage.getItem('ivoire_stock_session'));
            const fullSaleData = {
                ...saleData,
                userId: session?.id,
                username: session?.username,
                timestamp: new Date()
            };

            await db.sales.add(fullSaleData);

            if (session) {
                await db.logs.add({
                    userId: session.id,
                    username: session.username,
                    action: `Vente effectuée: ${saleData.total} FCFA`,
                    timestamp: new Date()
                });
            }
        });
    };

    return { sales, addSale };
}
