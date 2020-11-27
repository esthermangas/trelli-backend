const Card = require('../models/card');
const List = require('../models/list');

//GET ALL
exports.index = async function (req, res) {
    try {
        const cards = req.list.cards;
        res.status(200).json(cards);
    } catch (e){
        res.status(500).json({message: e.message});
    }
};

//GET ONE
exports.getOne = async function (req, res) {
    res.status(200).json(req.card);
};

//POST
exports.createOne = async function (req, res) {
    try {
        const data = req.body;
        data['list'] = req.list._id;
        data['order'] = req.list.getNextCardPosition(req.list);
        const newCard = new Card(data);
        newCard.save();
        req.list.cards.push(newCard._id);
        req.list.save();
        res.status(201).json(newCard);

    }catch (e) {
        res.status(500).json({message: e.message});
    }

};

//PATCH
exports.updateOne = async function (req, res) {

    const data = req.body;
    data['list'] =  req.list._id;
    Object.entries(data).forEach(([key, value]) =>{
        if(key === 'order' && data['order'] !== req.card.order){
            const maxOrder = req.card.order > data['order'] ? req.card.order : data['order'];
            const minOrder = req.card.order < data['order'] ? req.card.order : data['order'];
            const cardsToUpdate = req.list.cards.filter(c => {
                return c.order >= minOrder && c.order <= maxOrder && c.order !== req.card.order
            });
            cardsToUpdate.forEach(c => {
                if(req.card.order === minOrder){
                    c.order = c.order-1
                }else{
                    c.order = c.order+1;
                }
                c.save();
            })
        }
        req.card[key] = value;

    });
    try{
        const updatedCard = await req.card.save();
        res.status(200).json(updatedCard)
    }catch (e) {
        res.status(500).json({message: e.message});
    }

};


//DELETE
exports.deleteOne = async function (req, res) {
    try{
        const order = req.card.order;
        await req.card.remove();
        req.list.cards.forEach(card => {
            if(card.order > order) {
                card.order = card.order - 1;
                card.save();
            }
        });
        res.status(200).json({message: "Your card has been deleted."});
    }catch (e) {
        res.status(500).json({message: e.message});
    }
};



//MIDDLEWARE
exports.getCard = async function (req, res, next) {
    const card = req.list.cards.filter(c => c._id.toString() === req.params.idCard.toString())[0];
    if(!card) {
        return res.status(404).json({message: "Card not found"});
    }
    req.card = card;
    next();
};