const mysql = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();
require('dotenv').config();

// Database configuration
const dbServer = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
};

// SSH tunnel configuration
const tunnelConfig = {
    host: process.env.SSH_HOST,
    port: process.env.SSH_PORT,
    username: process.env.SSH_USERNAME,
    password: process.env.SSH_PASSWORD
}

// SSH forward configuration
const forwardConfig = {
    srcHost: process.env.SSH_SRCHOST,
    srcPort: process.env.SSH_SRCPORT,
    dstHost: process.env.DB_HOST,
    dstPort: process.env.DB_PORT
}

if (process.env.USE_SSH == 0) {
    // Connect to database on localhost
    module.exports = mysql.createConnection(dbServer);
} else {
    // Connect to database via SSH
    module.exports = new Promise((resolve, reject) => {
        sshClient.on('ready', () => {
            sshClient.forwardOut(
                forwardConfig.srcHost,
                forwardConfig.srcPort,
                forwardConfig.dstHost,
                forwardConfig.dstPort,
                (err, stream) => {
                    if (err) reject(err);
                    const updatedDbServer = {
                        ...dbServer,
                        multipleStatements: false,
                        stream
                    };
    
                    const connection = mysql.createConnection(updatedDbServer);
    
                    connection.connect((error) => {
                        if (error) reject (error);
                        resolve(connection);
                    });
                }
            );
        }).connect(tunnelConfig);
    });
};