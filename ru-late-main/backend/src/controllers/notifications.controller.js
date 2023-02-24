const db = require('../services/db.service');
const AppError = require('../utils/error.util');

exports.get = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Get all notifications
        let query = 'SELECT NotificationID AS notificationId, RouteID AS routeId, StopID AS stopId, ExecutionTime AS timestamp FROM EmailSchedule WHERE UserID = ?';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            res.status(200).send(result);
        });
    } catch (err) {
        next(err);
    }
}

// TODO: check if notification already exists
exports.add = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { routeId, stopId, notifTime } = req.body;

        // Add notification
        let query = 'INSERT INTO EmailSchedule (UserID, RouteID, StopID, ExecutionTime) VALUES (?, ?, ?, ?)';
        let placeholders = [userId, routeId, stopId, notifTime];
        db(query, placeholders, res, (result, res) => {
            res.status(201).json({
                status: 'success'
            });
        });
    } catch (err) {
        next(err);
    }
}

// TODO: check if notification exists
exports.delete = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { notificationId } = req.params;

        // Delete notification 
        let query = 'DELETE FROM EmailSchedule WHERE NotificationID = ?';
        let placeholders = [notificationId];
        db(query, placeholders, res, (result, res) => {
            res.status(200).json({
                status: 'success'
            });
        });
    } catch (err) {
        next(err);
    }
}

// TODO: check if user with user ID exists
exports.getByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Get all notifications for user
        let query = 'SELECT * FROM EmailSchedule WHERE UserID = ?';
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            res.status(200).send(result);
        });
    } catch (err) {
        next(err);
    }
}