const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

//Middleware that Protects API Routes
exports.auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;

        if (!token) {
            res.clearCookie('token', {
                path: '/',
                sameSite: 'none',
                secure: true
            });
            return res.status(401).json({ title: 'Unathorized Access', msg: 'Access Denied. No Token Available.' });
        }

        const verified = jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie('token', {
                    path: '/',
                    sameSite: 'none',
                    secure: true
                });
                return res.status(401).json({ title: 'Invalid JWT Token', msg: 'Invalid Auth JWT Token' });
            }
        });
        next();
    } catch (err) {
        res.clearCookie('token', {
            path: '/',
            sameSite: 'none',
            secure: true
        });
        res.status(400).json({ title: 'Invalid JWT Token', msg: 'Invalid Auth JWT Token', redirectTo: '/signin' });
    }
});