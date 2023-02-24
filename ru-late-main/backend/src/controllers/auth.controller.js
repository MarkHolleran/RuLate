const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const db = require('../services/db.service');
const AppError = require('../utils/error.util');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password.util');

// TODO: validate fields
exports.signup = (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body;
        const hashedPassword = hashPassword(password);

        // Check if user with that email already exists
        let query = 'SELECT COUNT(*) AS count FROM User WHERE Email = ?';
        let placeholders = [email];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count !== 0) {
                const appErr = new AppError(409, "fail", "User with that email already exists");
                return next(appErr, req, res, next);
            } else {
                // Add user to database
                query = 'INSERT INTO User (Email, Password, Name) VALUE (?, ?, ?);';
                placeholders = [email, hashedPassword, name];
                db(query, placeholders, res, (result, res) => {
                    if (phone !== null && phone.trim() !== "") {
                        // Add phone number to user if a phone number was input
                        query = 'UPDATE User SET Phone = ? WHERE Email = ?';
                        placeholders = [phone, email];
                        db(query, placeholders, res, (result, res) => {
                            res.status(201).json({
                                status: "success",
                            });
                        });
                    } else {
                        // Finish if no phone number was input
                        res.status(201).json({
                            status: "success",
                        });
                    }
                });
            }
        });
    } catch (err) {
        next(err);
    }
};

// TODO: validate fields
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user with that email exists
        let query = 'SELECT UserID as userId, Password as password FROM User WHERE Email = ?';
        let placeholders = [email];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                // Email does not exist
                const appErr = new AppError(401, "fail", "Email or password is incorrect");
                return next(appErr, req, res, next);
            } else if (!comparePassword(password, result[0].password)) {
                // Password doesn't match
                const appErr = new AppError(401, "fail", "Email or password is incorrect");
                return next(appErr, req, res, next);
            } else {
                // Create JWT
                const user = {
                    userId: result[0].userId
                };
                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Return JWT in response
                res.status(200).json({
                    status: "success",
                    token,
                });
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.protect = async (req, res, next) => {
    try {
        // Get token from request
        let token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
            if (token === 'null') token = null;
        }
        if (!token) {
            const appErr = new AppError(401, "fail", "You are not logged in");
            return next(appErr, req, res, next);
        }

        // Decode token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if user exists
        let query = 'SELECT UserID AS userId, Email AS email, Name AS name, Phone AS phone, Admin AS admin FROM User WHERE UserID = ?';
        let placeholders = [decoded.userId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                const appErr = new AppError(401, "fail", "User does not exist");
                return next(appErr, req, res, next);
            } else {
                // Pass user information to requested endpoint
                req.user = {
                    userId: result[0].userId,
                    email: result[0].email,
                    name: result[0].name,
                    phone: result[0].phone,
                    admin: result[0].admin
                }
                next();
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.admin = async (req, res, next) => {
    // Check if user is an admin
    if (req.user.admin === 0) {
        const appErr = new AppError(403, 'fail', 'User is not an admin');
        return next(appErr, req, res, next);
    } else {
        next();
    }
}
