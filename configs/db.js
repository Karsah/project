const express = require('express');
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'da_database',
    password: 'root'
});
module.exports = connection;
