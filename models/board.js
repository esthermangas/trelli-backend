const mongoose = require('mongoose');
const ListModel = require('./list');

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: 'The board\'s name is required',
    },

    lists: [{type: mongoose.Schema.Types.ObjectId, ref: 'List'}],
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],






}, {timestamps: true});

BoardSchema.methods.getNextListPosition = function(board) {
    const highestOrder = board.lists.reduce((acc, list) => {
        if(list.order > acc){
            acc = list.order;
        }
        return acc;
    }, 0);
    return highestOrder+1;
};


mongoose.set('useFindAndModify', false);
module.exports = mongoose.model('Board', BoardSchema);