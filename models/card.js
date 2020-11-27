const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    description: {
        type: String,
        required: false,
    },

    order:{
        type: Number,
        unique: false,
        required: true,
    },

    title: {
        type: String,
        unique: false,
        required: true,
    },

    list: {
        type: mongoose.Schema.ObjectId,
        ref: 'List',
        required: true,
    }


}, {timestamps: true});

mongoose.set('useFindAndModify', false);
module.exports = mongoose.model('Card', CardSchema);