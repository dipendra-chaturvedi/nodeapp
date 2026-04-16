const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'u268016451_Mgji',
    password: 'Nitesh@2026#',
    database: 'u268016451_lbuAy'
});

db.connect(err => {
    if (err) {
        console.error("DB Connection Error:", err);
        return;
    }
    console.log("DB Connected");
});

// HOME - list users
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {

        if (err) {
            console.error("DB ERROR:", err);
            return res.send("Database Error");
        }

        res.render('index', { users: result || [] });
    });
});

// ADD USER PAGE
app.get('/add', (req, res) => {
    res.render('add');
});

// ADD USER
app.post('/add', (req, res) => {
    const { name, email } = req.body;

    db.query('INSERT INTO users (name,email) VALUES (?,?)', [name, email], (err) => {
        if (err) {
            console.error("INSERT ERROR:", err);
            return res.send("Error adding user");
        }
        res.redirect('/');
    });
});

// VIEW USER
app.get('/view/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, result) => {

        if (err) {
            console.error("VIEW ERROR:", err);
            return res.send("Error fetching user");
        }

        res.render('view', { user: result[0] });
    });
});

// EDIT PAGE
app.get('/edit/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, result) => {

        if (err) {
            console.error("EDIT FETCH ERROR:", err);
            return res.send("Error fetching user");
        }

        res.render('edit', { user: result[0] });
    });
});

// UPDATE USER
app.post('/edit/:id', (req, res) => {
    const { name, email } = req.body;

    db.query('UPDATE users SET name=?, email=? WHERE id=?',
        [name, email, req.params.id],
        (err) => {
            if (err) {
                console.error("UPDATE ERROR:", err);
                return res.send("Error updating user");
            }
            res.redirect('/');
        }
    );
});

// DELETE USER
app.get('/delete/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {

        if (err) {
            console.error("DELETE ERROR:", err);
            return res.send("Error deleting user");
        }

        res.redirect('/');
    });
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));