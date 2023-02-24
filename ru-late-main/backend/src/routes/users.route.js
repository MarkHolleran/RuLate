const { Router } = require('express');
const router = Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/users.controller');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/get', userController.get);
router.put('/update', userController.update);
router.delete('/delete', userController.delete);

// Administrator-only routes after this middleware
router.use(authController.admin);

router.get('/get/:userId', userController.getUser);
router.get('/getAll', userController.getAllUsers);
router.put('/update/:userId', userController.updateUser);
router.delete('/delete/:userId', userController.deleteUser);

module.exports = router;