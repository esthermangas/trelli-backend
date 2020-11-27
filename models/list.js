const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        required: 'The list\'s name is required',
    },

    order:{
        type: Number,
        unique: false,
        required: true,
    },

    board: {
        type: mongoose.Schema.ObjectId,
        ref: 'Board',
        required: true,
    },

    cards: [{type: mongoose.Schema.Types.ObjectId, ref: 'Card'}],

}, {timestamps: true});

ListSchema.methods.getNextCardPosition = function(list) {
    const highestOrder = list.cards.reduce((acc, card) => {
        if(card.order > acc){
            acc = card.order;
        }
        return acc;
    }, 0);
    return highestOrder+1;
};


const ListModel = mongoose.model('List', ListSchema);

mongoose.set('useFindAndModify', false);
module.exports = ListModel;