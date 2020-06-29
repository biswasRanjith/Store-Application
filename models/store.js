const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
        name: String,
        logo: String,
        description: String,
        category: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now,
          },
    
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
// way 1 like this export n just require
// way 2 like passjwt folder dont export but model in another