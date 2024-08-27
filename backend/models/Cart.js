const db = require('../config/db');

const createCart = (email, cartData, abandonedAt) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO carts (email, cart_data, abandoned_at) VALUES (?, ?, ?)', 
            [email, JSON.stringify(cartData), abandonedAt], 
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
    });
};

const getAbandonedCarts = (checkTime) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM carts WHERE abandoned_at <= ? AND reminder_sent = FALSE', [checkTime], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

const markReminderSent = (cartId) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE carts SET reminder_sent = TRUE WHERE id = ?', [cartId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    createCart,
    getAbandonedCarts,
    markReminderSent
};
