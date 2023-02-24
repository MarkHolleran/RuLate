const db = require('../services/db.service');
const AppError = require('../utils/error.util');

exports.get = async (req, res, next) => {
    try {
        const { stopId } = req.params;

        // Get stop by stop ID
        let query = 'SELECT StopID as stopId, Name as name, Lat as lat, Lng as lng FROM Stops WHERE StopID = ?';
        let placeholders = [stopId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                const appErr = new AppError(404, "fail", "Stop does not exist");
                return next(appErr, req, res, next);
            } else {
                res.status(200).send(result[0]);
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.getAll = async (req, res, next) => {
    try {
        // Get all stops
        let query = 'SELECT StopID as stopId, Name as name, Lat as lat, Lng as lng FROM Stops';
        let placeholders = [];
        db(query, placeholders, res, (result, res) => {
            res.status(200).send(result);
        });
    } catch (err) {
        next(err);
    }
}

exports.getByRoute = async (req, res, next) => {
    try {
        const { routeId } = req.params;

        // Check if a route with that route ID exists
        let query = 'SELECT COUNT(*) AS count FROM Routes WHERE RouteID = ?';
        let placeholders = [routeId];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count === 0) {
                const appErr = new AppError(404, "fail", "Route does not exist");
                return next(appErr, req, res, next);
            } else {
                // Get all stops that are part of that route
                query = 'SELECT Stops.StopID as stopId, Name as name, Lat as lat, Lng as lng FROM Stops, RouteStopLink WHERE Stops.StopID = RouteStopLink.StopID AND RouteID = ?';
                db(query, placeholders, res, (result, res) => {
                    res.status(200).send(result);
                });
            }
        });
    } catch (err) {
        next(err);
    }
}