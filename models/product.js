const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
        name: String,
        image: String,
        description: String,
        price: Number, 
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store'
        }
    
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;