const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    price : {
        type: Number,
        required: true,
    },
    brand : {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    categoryId : {
        type: ObjectId,
        ref: 'Category'
    },
    imageId: [{
        type: ObjectId,
        ref: 'Image'
    }],
    featureId: [{
        type: ObjectId,
        ref: 'Feature'
    }]
});

module.exports = mongoose.model('Product', productSchema)