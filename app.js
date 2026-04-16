const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// DB connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'u268016451_Mgji',        // change later for hosting
    password: 'Nitesh@2026#',
    database: 'u268016451_lbuAy'
});

db.connect(err => {
    if (err) throw err;
    console.log("DB Connected");
});

// routes
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        res.render('index', { users: result });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name,email) VALUES (?,?)', [name, email], () => {
        res.redirect('/');
    });
});

app.get('/view/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, result) => {
        res.render('view', { user: result[0] });
    });
});

app.get('/edit/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id=?', [req.params.id], (err, result) => {
        res.render('edit', { user: result[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { name, email } = req.body;
    db.query('UPDATE users SET name=?, email=? WHERE id=?',
        [name, email, req.params.id],
        () => res.redirect('/')
    );
});

app.get('/delete/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id=?', [req.params.id], () => {
        res.redirect('/');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));