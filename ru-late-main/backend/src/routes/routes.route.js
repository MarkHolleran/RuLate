const { Router } = require('express');
const router = Router();

const authController = require('../controllers/auth.controller');
const routesController = require('../controllers/routes.controller');

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get/:routeId', routesController.get);
router.get('/getAll', routesController.getAll);
router.get('/getByStop/:stopId', routesController.getByStop);

// Administrator-only routes after this middleware
router.use(authController.admin);

router.put('/enable/:routeId', routesController.enable);
router.put('/disable/:routeId', routesController.disable);

module.exports = router;