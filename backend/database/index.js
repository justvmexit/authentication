const mysql = require('mysql');

module.exports = ((config) => {
    const connection = mysql.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.username,
        password: config.database.password,
        database: config.database.name
    });

    connection.connect((error) => {
        if(error) throw error;

        console.log('connected to database');
    });

    return connection;
});