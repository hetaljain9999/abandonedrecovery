

import React, { useState } from 'react';
import './App.css';

function App() {
    const [cart, setCart] = useState([]);
    const [email, setEmail] = useState('');

    const handleAddToCart = (product) => {
        setCart([...cart, product]);
    };

    const handleCheckout = () => {
        fetch('http://localhost:5000/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                cartData: cart
            }),
        })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            alert('Checkout initiated. You will receive a reminder if the purchase is not completed.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const products = [
        { name: 'Product 1', price: 10 },
        { name: 'Product 2', price: 15 },
        { name: 'Product 3', price: 20 },
        { name: 'Product 4', price: 25 },
        { name: 'Product 5', price: 30 },
        { name: 'Product 6', price: 35 },
        { name: 'Product 7', price: 40 },
        { name: 'Product 8', price: 45 },
        { name: 'Product 9', price: 50 },
        { name: 'Product 10', price: 55 }
    ];

    return (
        <div className="App">
            <h1>E-commerce Business</h1>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="product-listing">
                {products.map((product, index) => (
                    <div key={index} className="product">
                        <h2>{product.name}</h2>
                        <p>Price: ${product.price}</p>
                        <button onClick={() => handleAddToCart(product.name)}>Add to Cart</button>
                    </div>
                ))}
            </div>
            <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
    );
}

export default App;
