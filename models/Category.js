const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type : String,
        required : true
    },
    productId : [{
        type: ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Category', categorySchema)