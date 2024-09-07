const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
const pool = require('./db');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const User = require('./models/User'); // Adjust path as necessary

const secretKey = '123456789';

app.use(express.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(session({
    store: new pgSession({
        pool: pool, // Connection pool
        tableName: 'session' // Use another table-name than the default "session" one
    }),
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            console.log('No user with that email');
            return done(null, false, { message: 'No user with that email' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Password incorrect');
            return done(null, false, { message: 'Password incorrect' });
        }
        console.log('Authentication successful:', user);
        return done(null, user);
    } catch (error) {
        console.error('Error during authentication:', error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    console.log(user.customer_id);
    done(null, user.customer_id); // Serialize only the user ID
});

passport.deserializeUser(async (customer_id, done) => {
    try {
        const user = await User.findById(customer_id);
        console.log(user);
        if (user) {
            done(null, user);
        } else {
            done(new Error('User not found'));
        }
    } catch (error) {
        done(error);
    }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    console.log('Session ID:', req.sessionID); // Log the session ID
    console.log('Session:', req.session); // Log the session object
    console.log('User:', req.user); // Log the user object
    if (req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(401);
};

// Endpoint for logging in customers
app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Error during authentication:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            console.log('Authentication failed:', info.message);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Error during login:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.log('Login successful:', user);
            console.log('Session ID:', req.sessionID); // Log the session ID
            res.status(200).json({ message: 'Login successful', user });
        });
    })(req, res, next);
});

// Protected endpoints
app.get('/customers', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/customers/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/customers/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('UPDATE customers SET name = $1, email = $2, phone = $3, address = $4, password = $5 WHERE id = $6 RETURNING *', [name, email, phone, address, hashedPassword, id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/customers/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM customers WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoints for products
app.get('/products', authenticateToken, (req, res) => {
  console.log('Session ID:', req.sessionID); // Log the session ID
  if (req.isAuthenticated()) {
      console.log('User is authenticated:', req.user);
      // Fetch products from the database
      pool.query('SELECT * FROM products', (error, results) => {
          if (error) {
              console.error('Error fetching products:', error);
              res.status(500).send('Internal Server Error');
          } else {
              res.json(results.rows);
          }
      });
  } else {
      console.log('User is not authenticated');
      res.status(401).send('Unauthorized');
  }
});

app.get('/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/products', authenticateToken, async (req, res) => {
    try {
        const { name, price, description, quantity_in_store } = req.body;
        const result = await pool.query('INSERT INTO products (name, price, description, quantity_in_store) VALUES ($1, $2, $3, $4) RETURNING *', [name, price, description, quantity_in_store]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/products/:id', authenticateToken, async (req, res) => {
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

app.delete('/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoints for orders
app.get('/orders', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/orders/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/orders', authenticateToken, async (req, res) => {
    try {
        const { customer_id, date, total_amount, status } = req.body;
        const result = await pool.query('INSERT INTO orders (customer_id, date, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING *', [customer_id, date, total_amount, status]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/orders/:id', authenticateToken, async (req, res) => {
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

app.delete('/orders/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoints for order_items
app.get('/order_items', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM order_items');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/order_items/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM order_items WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/order_items', authenticateToken, async (req, res) => {
    try {
        const { order_id, product_id, quantity, price } = req.body;
        const result = await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, product_id, quantity, price]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/order_items/:id', authenticateToken, async (req, res) => {
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

app.delete('/order_items/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM order_items WHERE id = $1', [id]);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoints for home
app.get('/home', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the home page!' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});