const db = require('../services/db.service');
const AppError = require('../utils/error.util');

exports.get = async (req, res, next) => {
    try {
        const { routeId } = req.params;

        // Get route by route ID
        let query = 'SELECT RouteID as routeId, Name as name, Color as color, Enabled as enabled FROM Routes WHERE RouteID = ?';
        let placeholders = [routeId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                const appErr = new AppError(404, "fail", "Route does not exist");
                return next (appErr, req, res, next);
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
        // Get all routes
        let query = 'SELECT RouteID as routeId, Name as name, Color as color, Enabled as enabled FROM Routes';
        let placeholders = [];
        db(query, placeholders, res, (result, res) => {
            res.status(200).send(result);
        });
    } catch (err) {
        next(err);
    }
}

exports.getByStop = async (req, res, next) => {
    try {
        const { stopId } = req.params;
        
        // Check if a stop with that stop ID exists
        let query = 'SELECT COUNT(*) AS count FROM Stops WHERE StopID = ?';
        let placeholders = [stopId];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count === 0) {
                const appErr = new AppError(404, "fail", "Stop does not exist");
                return next(appErr, req, res, next);
            } else {
                // Get all routes that stop at that stop
                query = 'SELECT Routes.RouteID as routeId, Name as name, Color as color, Enabled as enabled FROM Routes, RouteStopLink WHERE Routes.RouteID = RouteStopLink.RouteID AND StopID = ?';
                db(query, placeholders, res, (result, res) => {
                    res.status(200).send(result);
                });
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.enable = async (req, res, next) => {
    try {
        const { routeId } = req.params;

        // Check if a route with that route ID exists
        let query = 'SELECT Enabled as enabled FROM Routes WHERE RouteID = ?';
        let placeholders = [routeId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                const appErr = new AppError(404, "fail", "Route does not exist");
                return next(appErr, req, res, next);
            } else {
                if (result[0].enabled === 1) {
                    // Route is already enabled
                    res.status(202).json({
                        status: 'success',
                        message: 'Route was already enabled'
                    });
                } else {
                    // Enable route
                    query = 'UPDATE Routes SET Enabled = 1 WHERE RouteID = ?';
                    placeholders = [routeId];
                    db(query, placeholders, res, (result, res) => {
                        res.status(200).json({
                            status: 'success'
                        });
                    });
                }
            }
        })
    } catch {
        next(err);
    }
}

exports.disable = async (req, res, next) => {
    try {
        const { routeId } = req.params;

        // Check if a route with that route ID exists
        let query = 'SELECT Enabled as enabled FROM Routes WHERE RouteID = ?';
        let placeholders = [routeId];
        db(query, placeholders, res, (result, res) => {
            if (result.length === 0) {
                const appErr = new AppError(404, "fail", "Route does not exist");
                return next(appErr, req, res, next);
            } else {
                if (result[0].enabled === 0) {
                    // Route is already disabled
                    res.status(202).json({
                        status: 'success',
                        message: 'Route was already disabled'
                    });
                } else {
                    // Disable route
                    query = 'UPDATE Routes SET Enabled = 0 WHERE RouteID = ?';
                    placeholders = [routeId];
                    db(query, placeholders, res, (result, res) => {
                        res.status(200).json({
                            status: 'success'
                        });
                    });
                }
            }
        })
    } catch {
        next(err);
    }
}