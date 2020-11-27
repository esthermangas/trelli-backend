const express = require('express');
const {check} = require('express-validator');
const ListController = require('../controllers/list');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const cardRouter = require('./card');
const router = express.Router();

//GET ALL
router.get('/', authenticate, ListController.index );
//GET ONE
router.get('/:idList', authenticate, ListController.getList, ListController.getOne);
//CREATE ONE
router.post('/', [
    check('name').not().isEmpty().withMessage('The name is required'),
], validate, authenticate, ListController.createOne);
//UPDATE ONE
router.patch('/:idList', authenticate, ListController.getList, ListController.updateOne);
//DELETE ONE
router.delete('/:idList', authenticate, ListController.getList, ListController.deleteOne);

router.use('/:idList/card',  authenticate, ListController.getList, cardRouter);


module.exports = router;