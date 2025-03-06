const express = require('express');
const path = require('path');
const { Pool } = require('pg'); // Import PostgreSQL client
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
const port = 3000;

// PostgreSQL Connection
const pool = new Pool({
    user: 'postgres',    // Replace with your PostgreSQL username
    host: 'localhost',        // Keep 'localhost' if running locally
    database: 'bankdb',    // Database name
    password: 'password',// Replace with your PostgreSQL password
    port: 5432,               // Default PostgreSQL port
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Signup Endpoint (Store User in PostgreSQL)
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into PostgreSQL
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        );

        res.json({ message: 'Account created successfully!', userId: result.rows[0].id });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'User already exists' });
        } else {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Login Endpoint (Verify User)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare hashed password
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Logged in successfully', userId: user.id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
