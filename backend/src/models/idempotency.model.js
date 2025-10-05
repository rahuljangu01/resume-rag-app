const mongoose = require('mongoose');

const idempotencySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    response: { type: Object, required: true },
    createdAt: { type: Date, expires: '24h', default: Date.now }
});

const Idempotency = mongoose.model('Idempotency', idempotencySchema);

module.exports = Idempotency;