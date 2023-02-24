require('dotenv').config();

const db = require('../configs/db.config');

if (process.env.USE_SSH == 0) {
    // Connect to database on localhost
    module.exports = (query, placeholders, res, func) => {
        db.query(query, placeholders, (err, result) => {
            if (err) throw err;
            func(result, res);
        });
    }
} else { 
    // Connect to database via SSH
    module.exports = (query, placeholders, res, func) => {
        db.then((conn) => {
            conn.query(query, placeholders, (err, result) => {
                if (err) throw err;
                func(result, res);
            });
        });
    };
}