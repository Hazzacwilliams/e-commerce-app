import React, { useState, useEffect } from 'react';
import '../page-styles/homeLoggedIn.css';

export default function HomeLoggedIn() {
    const [products, setProducts] = useState([]);

    const retrieveProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products', {
                credentials: 'include' // Include cookies in the request
            });
            if (response.status === 401) {
                console.error('Unauthorized access. Please log in.');
                return;
            }
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
                console.log('Products retrieved:', data);
            }
        } catch (error) {
            console.error('Error retrieving products:', error);
        }
    };

    useEffect(() => {
        retrieveProducts();
    }, []);

    return (
        <div id="table">
            <h1 id="storeName">HARRY'S PRODUCT EMPORIUM</h1>
            <table id="productTable">
                <thead>
                    <tr>
                        <th className="productHeader">NAME</th>
                        <th className="productHeader">PRICE</th>
                        <th className="productHeader">DESCRIPTION</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}