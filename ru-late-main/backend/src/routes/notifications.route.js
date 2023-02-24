const { Router } = require('express');
const router = Router();

const authController = require('../controllers/auth.controller');
const notificationsController = require('../controllers/notifications.controller');

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get', notificationsController.get);
router.post('/add', notificationsController.add);
router.delete('/delete/:notificationId', notificationsController.delete);

// Administrator-only routes after this middleware
router.use(authController.admin);

router.get('/getByUser/:userId', notificationsController.getByUser)

module.exports = router;