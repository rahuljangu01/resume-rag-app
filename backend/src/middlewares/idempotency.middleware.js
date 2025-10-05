const Idempotency = require('../models/idempotency.model');

const idempotencyCheck = async (req, res, next) => {
    if (req.method !== 'POST') {
        return next();
    }
    
    const idempotencyKey = req.headers['idempotency-key'];
    
    if (!idempotencyKey) {
        // Allow auth routes to pass without the key for simplicity
        if (req.path.startsWith('/auth')) {
            return next();
        }
        return res.status(400).json({ error: { code: 'IDEMPOTENCY_KEY_MISSING', message: 'Idempotency-Key header is required for POST requests.' } });
    }

    try {
        const existingRequest = await Idempotency.findOne({ key: idempotencyKey });
        if (existingRequest) {
            return res.status(200).json(existingRequest.response);
        }

        const originalJson = res.json;
        res.json = async function (body) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const idempotentRequest = new Idempotency({ key: idempotencyKey, response: body });
                await idempotentRequest.save();
            }
            return originalJson.call(this, body);
        };
        
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = idempotencyCheck;