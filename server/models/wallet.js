const mongoose = require('mongoose')
const walletSchema = new mongoose.Schema({
    money:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Wallet = mongoose.model('Wallet',walletSchema);

module.exports = Wallet;