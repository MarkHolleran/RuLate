const { Router } = require('express');
const router = Router();

const authController = require('../controllers/auth.controller');
const favoritesController = require('../controllers/favorites.controller');

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get', favoritesController.get);
router.get('/getDict', favoritesController.getDict);
router.post('/add', favoritesController.add);
router.delete('/delete', favoritesController.delete);

// Administrator-only routes after this middleware
router.use(authController.admin);

router.get('/getByUser/:userId', favoritesController.getByUser);

module.exports = router;