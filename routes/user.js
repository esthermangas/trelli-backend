const express = require('express');
const {check} = require('express-validator');
const UserController = require('../controllers/user');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

//GET ALL
router.get('/', authenticate, UserController.index );
//GET ONE
router.get('/:id', authenticate, UserController.getUser, UserController.getOne);
//CREATE ONE
router.post("/", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('name').not().isEmpty().withMessage('You name is required'),
    check('password').not().isEmpty().isLength({min: 6}).withMessage('Must be at least 6 chars long'),
], validate, authenticate, UserController.createOne);
//UPDATE ONE
router.patch("/:id", authenticate,UserController.getUser, UserController.updateOne);
//DELETE ONE
router.delete("/:id", authenticate, UserController.getUser, UserController.deleteOne);


module.exports = router;