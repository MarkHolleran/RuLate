const db = require('../services/db.service');
const AppError = require('../utils/error.util');

exports.get = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Get all favorites
        let query = 'SELECT RouteID as routeId, StopID as stopId FROM FavoriteRouteStop WHERE UserID = ? ORDER BY RouteID'
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            // Store favorites inside dictionary
            let favoritesDict = {};
            let favorites = [];
            result.forEach((row) => {
                if (!favoritesDict[row.routeId]) {
                    favoritesDict[row.routeId] = [row.stopId];
                } else {
                    favoritesDict[row.routeId].push(row.stopId);
                }
            });

            // Convert dictionary to array
            Object.keys(favoritesDict).forEach((routeId) => {
                favorites.push({
                    routeId: routeId,
                    stopIdList: favoritesDict[routeId]
                });
            });

            // Return favorites array
            res.status(200).send(favorites);
        });
    } catch (err) {
        next(err);
    }
}

exports.getDict = async (req, res, next) => {
    try {
        const { userId } = req.user;
        
        // Get all favorites
        let query = 'SELECT RouteID as routeId, StopID as stopId FROM FavoriteRouteStop WHERE UserID = ? ORDER BY RouteID'
        let placeholders = [userId];
        db(query, placeholders, res, (result, res) => {
            // Get favorites as dictionary
            let favorites = {};
            result.forEach((row) => {
                if (!favorites[row.routeId]) {
                    favorites[row.routeId] = [row.stopId];
                } else {
                    favorites[row.routeId].push(row.stopId);
                }
            });

            // Return favorites dictionary
            res.status(200).send(favorites);
        });
    } catch (err) {
        next(err);
    }
}

exports.add = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { routeId, stopId } = req.body;

        // Check if route-stop pair exists
        let query = 'SELECT COUNT(*) as count FROM RouteStopLink WHERE RouteID = ? AND StopID = ?';
        let placeholders = [routeId, stopId];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count === 0) {
                const appErr = new AppError(404, "fail", "Route-stop pair does not exist");
                return next(appErr, req, res, next);
            } else {
                // Check if route-stop pair is already favorited
                query = 'SELECT COUNT(*) as count FROM FavoriteRouteStop WHERE UserID = ? AND RouteID = ? AND StopID = ?';
                placeholders = [userId, routeId, stopId];
                db(query, placeholders, res, (result, res) => {
                    if (result[0].count !== 0) {
                        const appErr = new AppError(409, 'fail', 'User has already favorited that route-stop pair');
                        return next(appErr, req, res, next);
                    } else {
                        // Add route-stop pair to favorites
                        query = 'INSERT INTO FavoriteRouteStop (UserID, RouteID, StopID) VALUES (?, ?, ?)';
                        placeholders = [userId, routeId, stopId];
                        db(query, placeholders, res, (result, res) => {
                            res.status(201).json({
                                status: 'success'
                            });
                        });
                    }
                })
                
            }
        })
    } catch (err) {
        next(err);
    }
}

exports.delete = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { routeId, stopId } = req.body;

        // Check if route-stop pair is part of favorites
        let query = 'SELECT COUNT(*) as count FROM FavoriteRouteStop WHERE UserID = ? AND RouteID = ? AND StopID = ?';
        let placeholders = [userId, routeId, stopId];
        db(query, placeholders, res, (result, res) => {
            if (result[0].count === 0) {
                const appErr = new AppError(404, "fail", "Favorited route-stop pair does not exist");
                return next(appErr, req, res, next);
            } else {
                // Delete route-stop pair from favorites
                query = 'DELETE FROM FavoriteRouteStop WHERE UserID = ? AND RouteID = ? AND StopID = ?';
                placeholders = [userId, routeId, stopId];
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

exports.getByUser = async (req, res, next) => {
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
                // Get all favorites for that user
                let query = 'SELECT RouteID as routeId, StopID as stopId FROM FavoriteRouteStop WHERE UserID = ? ORDER BY RouteID'
                let placeholders = [userId];
                db(query, placeholders, res, (result, res) => {
                    // Get favorites as dictionary
                    let favoritesDict = {};
                    let favorites = [];
                    result.forEach((row) => {
                        if (!favoritesDict[row.routeId]) {
                            favoritesDict[row.routeId] = [row.stopId];
                        } else {
                            favoritesDict[row.routeId].push(row.stopId);
                        }
                    });

                    // Convert dictionary to array
                    Object.keys(favoritesDict).forEach((routeId) => {
                        favorites.push({
                            routeId: routeId,
                            stopIdList: favoritesDict[routeId]
                        });
                    });

                    // Return favorites array
                    res.status(200).send(favorites);
                });
            }
        });
    } catch (err) {
        next(err);
    }
}