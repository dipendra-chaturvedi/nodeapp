const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// ================= LOGGER =================
function log(message) {
    const text = `[${new Date().toLocaleString()}] ${message}\n`;

    console.log(text);              // Hostinger runtime logs
    fs.appendFileSync('app.log', text); // SSH file logs
}

// ================= DB CONNECTION =================
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
    if (err) log("❌ DB ERROR: " + err.message);
    else log("✅ DB Connected via Pool");
});

// ================= ROUTES =================

// HOME
app.get('/', (req, res) => {
    log("📥 GET /");

    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            log("❌ FETCH ERROR: " + err.message);
            return res.send("Database Error");
        }

        log(`✅ Users fetched: ${result.length}`);
        res.render('index', { users: result || [] });
    });
});

// ADD PAGE
app.get('/add', (req, res) => {
    log("📄 GET /add");
    res.render('add');
});

// ADD USER
app.post('/add', (req, res) => {
    const { name, email } = req.body;

    log(`➕ Adding user: ${name}, ${email}`);

    db.query('INSERT INTO users (name,email) VALUES (?,?)', [name, email], (err, result) => {
        if (err) {
            log("❌ INSERT ERROR: " + err.message);
            return res.send("Error adding user");
        }

        log(`✅ User added with ID: ${result.insertId}`);
        res.redirect('/');
    });
});

// VIEW USER
app.get('/view/:id', (req, res) => {
    const id = req.params.id;

    log(`👁️ VIEW user ID: ${id}`);

    db.query('SELECT * FROM users WHERE id=?', [id], (err, result) => {
        if (err) {
            log("❌ VIEW ERROR: " + err.message);
            return res.send("Error fetching user");
        }

        res.render('view', { user: result[0] });
    });
});

// EDIT PAGE
app.get('/edit/:id', (req, res) => {
    const id = req.params.id;

    log(`✏️ EDIT PAGE user ID: ${id}`);

    db.query('SELECT * FROM users WHERE id=?', [id], (err, result) => {
        if (err) {
            log("❌ EDIT FETCH ERROR: " + err.message);
            return res.send("Error fetching user");
        }

        res.render('edit', { user: result[0] });
    });
});

// UPDATE USER
app.post('/edit/:id', (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    log(`🔄 Updating user ID: ${id} | ${name}, ${email}`);

    db.query('UPDATE users SET name=?, email=? WHERE id=?',
        [name, email, id],
        (err) => {
            if (err) {
                log("❌ UPDATE ERROR: " + err.message);
                return res.send("Error updating user");
            }

            log(`✅ User updated ID: ${id}`);
            res.redirect('/');
        }
    );
});

// DELETE USER
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    log(`🗑️ Deleting user ID: ${id}`);

    db.query('DELETE FROM users WHERE id=?', [id], (err) => {
        if (err) {
            log("❌ DELETE ERROR: " + err.message);
            return res.send("Error deleting user");
        }

        log(`✅ User deleted ID: ${id}`);
        res.redirect('/');
    });
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    log("🚀 Server running successfully!");
    log(`🌐 Local: http://localhost:${PORT}`);
    log("🌍 Live: https://app.nodbot.org");
});