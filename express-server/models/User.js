const pool = require('../db'); // Adjust the path as necessary

const User = {
    findByEmail: async (email) => {
        const result = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
        return result.rows[0];
    },
    findById: async (id) => {
        const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
        return result.rows[0];
    },
    create: async (name, email, phone, address, hashedPassword) => {
        const result = await pool.query(
            'INSERT INTO customers (name, email, phone, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, phone, address, hashedPassword]
        );
        return result.rows[0];
    }
};

module.exports = User;