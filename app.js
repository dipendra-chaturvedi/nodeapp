const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DB connection (POOL)
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'u268016451_Mgjj1',
    password: 'Nitesh@2026#',
    database: 'u268016451_lbuAy',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
db.query('SELECT 1', (err) => {
    if (err) console.error("❌ DB ERROR:", err);
    else console.log("✅ DB Connected via Pool");
});


// HOME - list users
app.get('/', (req, res) => {
    console.log("📥 GET / (Fetch all users)");

    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error("❌ FETCH ERROR:", err);
            return res.send("Database Error");
        }

        console.log(`✅ Users fetched: ${result.length}`);
        res.render('index', { users: result || [] });
    });
});


// ADD USER PAGE
app.get('/add', (req, res) => {
    console.log("📄 GET /add (Open add form)");
    res.render('add');
});


// ADD USER
app.post('/add', (req, res) => {
    const { name, email } = req.body;

    console.log("➕ Adding user:", name, email);

    db.query('INSERT INTO users (name,email) VALUES (?,?)', [name, email], (err, result) => {
        if (err) {
            console.error("❌ INSERT ERROR:", err);
            return res.send("Error adding user");
        }

        console.log(`✅ User added with ID: ${result.insertId}`);
        res.redirect('/');
    });
});


// VIEW USER
app.get('/view/:id', (req, res) => {
    const id = req.params.id;
    console.log(`👁️ VIEW user ID: ${id}`);

    db.query('SELECT * FROM users WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error("❌ VIEW ERROR:", err);
            return res.send("Error fetching user");
        }

        res.render('view', { user: result[0] });
    });
});


// EDIT PAGE
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    console.log(`✏️ EDIT PAGE for user ID: ${id}`);

    db.query('SELECT * FROM users WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error("❌ EDIT FETCH ERROR:", err);
            return res.send("Error fetching user");
        }

        res.render('edit', { user: result[0] });
    });
});


// UPDATE USER
app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    console.log(`🔄 Updating user ID: ${id}`, name, email);

    db.query('UPDATE users SET name=?, email=? WHERE id=?',
        [name, email, id],
        (err) => {
            if (err) {
                console.error("❌ UPDATE ERROR:", err);
                return res.send("Error updating user");
            }

            console.log(`✅ User updated ID: ${id}`);
            res.redirect('/');
        }
    );
});


// DELETE USER
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    console.log(`🗑️ Deleting user ID: ${id}`);

    db.query('DELETE FROM users WHERE id=?', [id], (err) => {
        if (err) {
            console.error("❌ DELETE ERROR:", err);
            return res.send("Error deleting user");
        }

        console.log(`✅ User deleted ID: ${id}`);
        res.redirect('/');
    });
});


// SERVER START
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running successfully!");
    console.log(`🌐 Local: http://localhost:${PORT}`);

    // Hostinger / production URL (optional info)
    console.log("🌍 Live: https://app.nodbot.org");
});