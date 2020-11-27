const express = require('express');
const {check} = require('express-validator');
const CardController = require('../controllers/card');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

//GET ALL
router.get('/', authenticate, CardController.index );
//GET ONE
router.get('/:idCard', authenticate, CardController.getCard, CardController.getOne);
//CREATE ONE
router.post('/', [
    check('title').not().isEmpty().withMessage('The title is required'),
], validate, authenticate, CardController.createOne);
//UPDATE ONE
router.patch('/:idCard', authenticate, CardController.getCard, CardController.updateOne);
//DELETE ONE
router.delete('/:idCard', authenticate, CardController.getCard, CardController.deleteOne);


module.exports = router;