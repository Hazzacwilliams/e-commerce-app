const express = require('express')
const path = require('path');
const app = express()
const port = 3000
const pool = require('./db');

app.use(express.json());

app.use(express.static(path.join(__dirname, '../my-app/build')))

//Endpoints for customers

app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/customers', async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const result = await pool.query('INSERT INTO customers (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, email, phone, address, password]);  
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, password } = req.body;
    const result = await pool.query('UPDATE customers SET name = $1, email = $2, phone = $3, address = $4, password = $5 WHERE id = $6 RETURNING *', [name, email, phone, address, password, id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Endpoints for products

app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, price, description, quantity_in_store } = req.body;
    const result = await pool.query('INSERT INTO products (name, price, description, quantity_in_store) VALUES ($1, $2, $3, $4) RETURNING *', [name, price, description, quantity_in_store]);  
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity_in_store } = req.body;
    const result = await pool.query('UPDATE products SET name = $1, price = $2, description = $3, quantity_in_store = $4 WHERE id = $5 RETURNING *', [name, price, description, quantity_in_store, id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Endpoints for orders

app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { customer_id, date, total_amount, status } = req.body;
    const result = await pool.query('INSERT INTO orders (customer_id, date, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *', [customer_id, date, total_amount, status]);  
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, date, total_amount, status } = req.body;
    const result = await pool.query('UPDATE orders SET customer_id = $1, date = $2, total_amount = $3, status = $4 WHERE id = $5 RETURNING *', [customer_id, date, total_amount, status, id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

//Endpoints for order_items

app.get('/order_items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM order_items');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/order_items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM order_items WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/order_items', async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;
    const result = await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, product_id, quantity, price]);  
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/order_items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { order_id, product_id, quantity, price } = req.body;
    const result = await pool.query('UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3, price = $4 WHERE id = $5 RETURNING *', [order_id, product_id, quantity, price, id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/order_items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM order_items WHERE id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})