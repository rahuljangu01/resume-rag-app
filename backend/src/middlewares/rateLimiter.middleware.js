const { rateLimit } = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        res.status(options.statusCode).json({
            error: {
                code: "RATE_LIMIT",
                message: "Too many requests, please try again after a minute."
            }
        });
    },
});

module.exports = apiLimiter;