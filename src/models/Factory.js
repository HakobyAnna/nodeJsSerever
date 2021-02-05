const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FactorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    employers: {
        type: Array,
        required: true,
    },
    product: {
        type: Array,
        required: true,
    },
});

FactorySchema.plugin(timestamp);

const Factory = mongoose.model('Factory', FactorySchema );
module.exports = Factory;