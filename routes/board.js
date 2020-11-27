const express = require('express');
const {check} = require('express-validator');
const BoardController = require('../controllers/board');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();
const listRouter = require("./list");

//GET ALL
router.get('/', authenticate, BoardController.index );
//GET ONE
router.get('/:id', authenticate, BoardController.getBoard, BoardController.getOne);
//CREATE ONE
router.post("/", [
    check('name').not().isEmpty().withMessage('The name is required'),
], validate, authenticate, BoardController.createOne);
//UPDATE ONE
router.patch('/:id', authenticate, BoardController.getBoard, BoardController.updateOne);
//DELETE ONE
router.delete('/:id', authenticate, BoardController.getBoard, BoardController.deleteOne);

router.use('/:id/list',  authenticate, BoardController.getBoard, listRouter);


module.exports = router;