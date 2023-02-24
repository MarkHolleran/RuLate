require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');

const globalErrHandler = require('./src/controllers/error.controller');
const AppError = require('./src/utils/error.util');
const app = express();
const port = process.env.PORT || 3000;
const site = process.env.SITE || null;

console.log(process.env.SSH_SRCHOST);

app.use(cors());
app.use(helmet());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(hpp());

// Pre-route options
app.use((req, res, next) => {
    // Add Access Control Allow Origin headers
    res.setHeader('Access-Control-Allow-Origin', site);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    // Print request
    console.log(`${req.method} - ${req.url}`);
    next();
});

// Routes
app.use('/users', require('./src/routes/users.route'));
app.use('/favorites', require('./src/routes/favorites.route'));
app.use('/notifications', require('./src/routes/notifications.route'));
app.use('/routes', require('./src/routes/routes.route'));
app.use('/stops', require('./src/routes/stops.route'));

// Handle undefined routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

app.listen(port, () => {
    console.log(`Server is running on Port ${port}.`);
});