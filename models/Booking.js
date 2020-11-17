const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const bookingSchema = new Schema({
    bookingStartDate: {
        type : Date,
        required : true
    },
    bookingEndDate : {
        type: Date,
        required: true,
    },
    productId: [{
        _id: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        title : {
            type: String,
            required: true
        },
        price : {
            type: Number,
            required: true
        },
        duration : {
            type: Number,
            required: true
        }
    }],
    memberId: {
        type: ObjectId,
        ref: 'Member'
    },
    bankId: {
        type: ObjectId,
        ref: 'Bank'
    },
    payments: {
        proofPayment : {
            type:String,
            required:true
        },
        bankFrom : {
            type: String,
            required:true
        },
        accountHolder: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required:true
        }
    }
});

module.exports = mongoose.model('Booking', bookingSchema)