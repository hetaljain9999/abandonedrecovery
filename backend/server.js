

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hetal@8290',
    database: 'ecommerce'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Create the 'carts' table if it doesn't exist
const createCartsTable = `
CREATE TABLE IF NOT EXISTS carts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    cart_data JSON NOT NULL,
    abandoned_at DATETIME NOT NULL,
    reminder_sent BOOLEAN DEFAULT FALSE
);
`;

db.query(createCartsTable, (err, result) => {
    if (err) {
        console.error('Error creating carts table:', err);
    } else {
        console.log('Carts table ready');
    }
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'hetaljain717@gmail.com',
        pass: 'bndkuaqbowfbjfch'
    }
});

// Endpoint to handle cart updates
app.post('/cart/update', async (req, res) => {
    const { email, cartData } = req.body;
    const abandonedAt = new Date();

    db.query('INSERT INTO carts (email, cart_data, abandoned_at) VALUES (?, ?, ?)', 
        [email, JSON.stringify(cartData), abandonedAt], 
        (err, result) => {
            if (err) {
                console.error('Error inserting cart data:', err);
                return res.status(500).send('Server error');
            }
            res.send('Cart updated');
        });
});

// Schedule a cron job to check for abandoned carts every hour
cron.schedule('0 * * * *', () => {
    const delayInMinutes = 30;
    const currentTime = new Date();
    const checkTime = new Date(currentTime.getTime() - delayInMinutes * 60000);

    db.query('SELECT * FROM carts WHERE abandoned_at <= ? AND reminder_sent = FALSE', [checkTime], (err, carts) => {
        if (err) {
            console.error('Error fetching abandoned carts:', err);
            return;
        }

        carts.forEach((cart) => {
            const mailOptions = {
                from: 'hetaljain717@gmail.com',
                to: 'hetaljain.bsw@gmail.com',  // Use the cart owner's email
                subject: 'Your cart is waiting for you!',
                text: 'You have items left in your cart. Complete your purchase now!'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);

                    db.query('UPDATE carts SET reminder_sent = TRUE WHERE id = ?', [cart.id], (err, result) => {
                        if (err) {
                            console.error('Error updating reminder status:', err);
                        }
                    });
                }
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
