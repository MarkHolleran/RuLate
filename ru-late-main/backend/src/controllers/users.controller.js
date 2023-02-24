const db = require('../services/db.service');
const AppError = require('../utils/error.util');

exports.get = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Check if user with that user ID exists
        let query = 'SELECT UserID AS userId, Email AS email, Name AS name, Phone AS phone, Admin as admin FROM User WHERE UserID = ?';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                const appErr = new AppError(404, "fail", "Own user not found");
                return next(appErr, req, res, next);
            } else {
                // Returns user
                res.status(200).send(result[0]);
            }
        });
    } catch (err) {
        next(err);
    }
}

// TODO: validate fields
exports.update = async (req, res, next) => {
    try {
        const { userId } = req.user;
        let email, name, phone;

        // Fields that are left blank or are not included are not updated
        if (req.body.email) {
            email = (req.body.email.trim() === '') ? req.user.email : req.body.email.trim();
        } else email = req.user.email;
        if (req.body.name) {
            name = (req.body.name.trim() === '') ? req.user.name : req.body.name.trim();
        } else name = req.user.name;
        if (req.body.phone) {
            phone = (req.body.phone.trim() === '') ? null : req.body.phone.trim();
        } else phone = null;

        // Return error if no fields are changed from before
        if (email === req.user.email && name === req.user.name && phone === req.user.phone) {
            const appErr = new AppError(400, "fail", "No values were changed from the original user");
            return next(appErr, req, res, next);
        }

        // Check if a different user already has that email
        let query = 'SELECT COUNT(*) as count FROM User WHERE UserID != ? AND Email = ?';
        let placeholders = [userId, email];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count > 0) {
                const appErr = new AppError(409, "fail", "A user with the same email address already exists");
                return next(appErr, req, res, next);
            } else {
                // Update user
                query = 'UPDATE User SET Email = ?, Name = ?, Phone = ? WHERE UserID = ?';
                placeholders = [email, name, phone, userId];
                db(query, placeholders, res, (result, res) => {
                    res.status(200).json({
                        status: 'success'
                    });
                })
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Check if there are any other admin users
        let query = 'SELECT COUNT(*) AS count FROM User WHERE UserID != ? AND Admin = 1';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count === 0) {
                const appErr = new AppError(405, "fail", "Cannot delete user when they are the only admin");
                return next(appErr, req, res, next);
            } else {
                // Delete user
                query = 'DELETE FROM User WHERE UserID = ?';
                db(query, placeholders, res, (result, res) => {
                    res.status(200).json({
                        status: 'success'
                    });
                });
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        // Gets user
        let query = 'SELECT UserID AS userId, Email AS email, Name AS name, Phone AS phone, Admin as admin FROM User WHERE UserID = ?';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                // User with that user ID does not exist
                const appErr = new AppError(404, "fail", "User not found");
                next(appErr, req, res, next);
            } else {
                // Return user information
                return res.status(200).send(result[0]);
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        // Get all users
        let query = 'SELECT UserID AS userId, Email AS email, Name AS name, Phone AS phone, Admin as admin FROM User';
        let placeholders = []
        db(query, placeholders, res, (result, res) => {
            res.status(200).send(result);
        });
    } catch (err) {
        next(err);
    }
}

// TODO: validate fields
// TODO: prevent last admin from removing own admin privileges
exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Get user information for the user with that user ID
        let query = 'SELECT UserID AS userId, Email AS email, Name AS name, Phone AS phone, Admin as admin FROM User WHERE UserID = ?';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                // User does not exist
                const appErr = new AppError(404, "fail", "User does not exist");
                return next(appErr, req, res, next);
            } else {
                // Blank inputs are counted as non-changes for required fields
                let email, name, phone, admin;

                // Fields that are left blank or are not included are not updated
                if (req.body.email) {
                    email = (req.body.email.trim() === '') ? result[0].email : req.body.email.trim();
                } else email = result[0].email;
                if (req.body.name) {
                    name = (req.body.name.trim() === '') ? result[0].name : req.body.name.trim();
                } else name = result[0].name;
                if (req.body.phone) {
                    phone = req.body.phone.trim();
                } else phone = null;
                if (req.body.admin) {
                    admin = (req.body.admin.trim() === '') ? result[0].admin : req.body.admin.trim();
                } else admin = result[0].admin;

                if (admin != 0 && admin != 1) {
                    // '!=' rather than '!==' intentional
                    const appErr = new AppError(400, "fail", "Invalid input for admin field");
                    return next(appErr, req, res, next);
                } else if (email === result[0].email && name === result[0].name && phone === result[0].phone && admin === result[0].admin) {
                    // Return error if no fields are changed from before
                    const appErr = new AppError(400, "fail", "No values were changed from the original user");
                    return next(appErr, req, res, next);
                }
                
                // Check if a different user already has that email address
                query = 'SELECT COUNT(*) AS count FROM User WHERE UserID != ? AND Email = ?';
                placeholders = [userId, email];
                db(query, placeholders, res, (result, res) => {
                    if (result[0].count > 0) {
                        const appErr = new AppError(409, "fail", "A user with the same email address already exists");
                        return next(appErr, req, res, next);
                    } else {
                        // Update user
                        query = 'UPDATE User SET Email = ?, Name = ?, Phone = ?, Admin = ? WHERE UserID = ?';
                        placeholders = [email, name, phone, admin, userId];
                        db(query, placeholders, res, (result, res) => {
                            res.status(200).json({
                                status: 'success'
                            });
                        });
                    }
                });
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Check if user with that user ID exists
        let query = 'SELECT COUNT(*) AS count FROM User WHERE UserID = ?';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count === 0) {
                const appErr = new AppError(404, "fail", "User does not exist");
                return next(appErr, req, res, next);
            } else {
                // Check if there are other admin users
                query = 'SELECT COUNT(*) AS count FROM User WHERE UserID != ? AND Admin = 1';
                placeholders = [userId];
                db(query, placeholders, res, (result, res) => {
                    if (result[0].count === 0) {
                        const appErr = new AppError(405, "fail", "Cannot delete user when they are the only admin");
                        return next(appErr, req, res, next);
                    } else {
                        //  Delete user
                        query = 'DELETE FROM User WHERE UserID = ?';
                        db(query, placeholders, res, (result, res) => {
                            res.status(200).json({
                                status: 'success'
                            });
                        });
                    }
                });
            }
        });
    } catch (err) {
        next(err);
    }
}