const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    port: '3306',
    password:'bianca',
    database:'crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Conectado!');
}); 

app.use('/static', express.static('public'))

//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'Hello world! Welcome to my system 😊',
            users : rows
        });
    });
});

app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'Adicionar usúarios 😜'
    });
});

app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, pwd: req.body.pwd};
    let sql = `Select * from users where email = '${data.email}'`;
    connection.query(sql,(err, result) => {
        if(err) throw err;
        console.log(result)
        if(result.length > 0) {
            res.render('user_error', {
                title : 'Pagina de erro 📝'
            });
        } else {
            let sqlInsert = "INSERT INTO users SET ?";
            connection.query(sqlInsert, data,(err, results) => {
                if(err) throw err;
                res.redirect('/');
            });        
        }
    });
});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'Editar informações do usúario 📝',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  pwd='"+req.body.pwd+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// server

app.listen(3000, () => {
    console.log('server irá ligar na porta 3000');
});
