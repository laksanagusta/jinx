const mongoose = require("mongoose");
const { Schema } = mongoose;

const memberSchema = new Schema({
    fullName: {
        type : String,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Member', memberSchema)