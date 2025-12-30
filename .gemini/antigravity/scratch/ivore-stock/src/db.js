import Dexie from 'dexie';

export const db = new Dexie('IvoireStockDB');

db.version(5).stores({
    products: '++id, name, barcode, price, stock, minStock, category, unit',
    sales: '++id, date, total, paymentMethod, items',
    settings: 'key, value',
    users: '++id, username, password, role, permissions',
    invites: '++id, code, role, status, permissions',
    logs: '++id, userId, username, action, timestamp',
    requests: '++id, type, data, userId, username, timestamp, status'
});
