const List = require('../models/list');
const Board = require('../models/board');

//GET ALL
exports.index = async function (req, res) {
    try {
        const lists = req.board.lists;
        res.status(200).json(lists);
    } catch (e){
        res.status(500).json({message: e.message});
    }
};

//GET ONE
exports.getOne = async function (req, res) {
    res.status(200).json(req.list);
};

//POST
exports.createOne = async function (req, res) {
    try {

        const foundLists = req.board.lists.filter(l => l.name.toLowerCase() === req.body.name.toLowerCase());

        if (foundLists.length > 0) {
            res.status(404).json({error: {name: 'That list name is already in use'}});
        }else {
            const data = req.body;
            data['board'] = req.board._id;
            data['order'] = req.board.getNextListPosition(req.board);
            const newList = new List(data);
            newList.save();
            req.board.lists.push(newList._id);
            req.board.save();
            res.status(201).json(newList);

        }
    }catch (e) {
        res.status(500).json({message: e.message});
    }

};

//PATCH
exports.updateOne = async function (req, res) {

    const foundLists = req.body.name ? req.board.lists.filter(l => l.name.toLowerCase() === req.body.name.toLowerCase()) : [];
    if (foundLists.length > 0) {
        res.status(404).json({error: {name: 'That list name is already in use'}});
    }else {
        const data = req.body;
        data['board'] =  req.board._id;
        Object.entries(data).forEach(([key, value]) =>{
            if(key === 'order' && data['order'] !== req.list.order){
                const maxOrder = req.list.order > data['order'] ? req.list.order : data['order'];
                const minOrder = req.list.order < data['order'] ? req.list.order : data['order'];
                const listsToUpdate = req.board.lists.filter(l => {
                    return l.order >= minOrder && l.order <= maxOrder && l.order !== req.list.order
                });
                listsToUpdate.forEach(l => {
                    if(req.list.order === minOrder){
                        l.order = l.order-1
                    }else{
                        l.order = l.order+1;
                    }
                    l.save();
                })
            }
            if(req.list[key]){
                req.list[key] = value;
            }
        });

        try{

            const updatedList = await req.list.save();
            res.status(200).json(updatedList)
        }catch (e) {
            res.status(500).json({message: e.message});
        }
    }

};


//DELETE
exports.deleteOne = async function (req, res) {
        try{
            const order = req.list.order;
            await req.list.remove();
            req.board.lists.forEach(list => {
                if(list.order > order) {
                    list.order = list.order - 1;
                    list.save();
                }
            });

            res.status(200).json({message: "Your list has been deleted."});
        }catch (e) {
            res.status(500).json({message: e.message});
        }
};


//MIDDLEWARE
exports.getList = async function (req, res, next) {
    const list = req.board.lists.filter(l => l._id.toString() === req.params.idList.toString())[0];
    if(!list) {
        return res.status(404).json({message: "List not found"});
    }
    const listPopu = await List.findById(list._id).populate("cards");
    req.list = listPopu;
    next();
};