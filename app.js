const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const users = require('./data/users');


const app = express();

app.use(bodyParser.json());

app.get('/users', (req, res) => {
    res.json(users);
});

const writeUser = (json) =>{
    fs.writeFile('./data/users.json', JSON.stringify(json), err => console.log(err) );
};

app.get('/users/:id', (req, res) =>{
    res.json(users.find(user => user.id == req.params.id));
});

app.post('/users', (req, res) => {
    const {id, username, password, firstname, surname, account_type } = req.body;
    
    const user_ids = users.map(u => u.id);

    const new_users = users.concat({
        id: (user_ids.length > 0 ? Math.max(...user_ids): 0) + 1,
        username,
        password,
        firstname,
        surname,
        account_type
    });
    writeUser(new_users);
    res.json(new_users);
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const old_user = users.find(u => u.id == id);

    ['password', 'firstname', 'surname'].forEach(key => {
        if(req.body[key]) old_user[key] = req.body[key];
    });
    writeUser(old_user);
    res.json(old_user);
});

app.delete('/users/:id', (req, res) =>{
    const { id } = req.params;
    const new_users = users.filter(u => u.id != id );

    writeUser(new_users);
    res.json(new_users);
});
module.exports = app;