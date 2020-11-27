const Board = require('../models/board');
const List = require('../models/list');

//GET ALL
exports.index = async function (req, res) {
    try {
        res.status(200).json(req.authUser.boards);
    } catch (e){
        res.status(500).json({message: e.message});
    }
};

//GET ONE
exports.getOne = async function (req, res) {
    res.status(200).json(req.board);
};

//POST
exports.createOne = async function (req, res) {
    try {
        const board = await Board.findOne({name: req.body.name});

        if (board) {
            res.status(401).json({error: {name: 'The board is already created.'}});
        }else {
            const newBoard = new Board(req.body);
            newBoard.users.push(req.authUser._id);
            try {
                newBoard.save();
                req.authUser.boards.push(newBoard._id);
                req.authUser.save();
                res.status(201).json(newBoard);
            }catch (e) {
                res.status(500).json({message: e.message});
            }

        }
    }catch (e) {
        res.status(500).json({message: e.message});
    }

};

//PATCH
exports.updateOne = async function (req, res) {

    Object.entries(req.body).forEach(([key, value]) =>{
        if(req.board[key]){
            req.board[key] = value;
        }
    });

    try{
        const updatedBoard = await req.board.save();
        res.status(200).json(updatedBoard)
    }catch (e) {
        res.status(500).json({message: e.message});
    };
};


//DELETE
exports.deleteOne = async function (req, res) {

    try{
        await req.board.remove();
        res.status(200).json({message: "Your board has been deleted."});
    }catch (e) {
        res.status(500).json({message: e.message});
    }

};


//MIDDLEWARE
exports.getBoard = async function (req, res, next) {
    try{
        board = await Board.findOne({_id: req.params.id}).populate("lists");

        if(board == null || !board.users.includes(req.authUser._id)) {
            return res.status(404).json({message: "Board not found"});
        }
    }catch (e) {
        res.status(500).json({message: e.message});
    }

    const listPromises = board.lists.map((list) => (List.findById(list._id).populate("cards")));

    board.lists = await Promise.all(listPromises);
    req.board = board;
    next();
};