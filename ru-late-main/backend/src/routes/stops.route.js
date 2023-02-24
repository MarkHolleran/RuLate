const { Router } = require('express');
const router = Router();

const authController = require('../controllers/auth.controller');
const stopsController = require('../controllers/stops.controller');

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get/:stopId', stopsController.get);
router.get('/getAll', stopsController.getAll);
router.get('/getByRoute/:routeId', stopsController.getByRoute);

module.exports = router;