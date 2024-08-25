const express = require('express');
const asyncHandler = require('express-async-handler');

//Index Controller Function
exports.index = asyncHandler((req, res, next) => {
    res.json({
        route: '/',
        method: 'GET',
        subRoute: '-',
        message: 'Welcome Everyone to Playlist Management Project!'
    });
});

exports.verifyToken = asyncHandler((req, res, next) => {
    const token = req?.cookies?.token;
    console.log('Token-------->', token);

    if (!token) {
        return res.status(401).json({
            title: 'Unauthorized Access',
            msg: 'Unauthorized User Access'
        });
    }

    try {
        return res.status(200).json({
            title: 'User Authenticated',
            msg: 'Authenticated User Access',
            authenticated: true,
        });
    } catch (e) {
        return res.status(401).json({
            title: 'Unauthorized Access',
            msg: 'Unauthorized User Access'
        });
    }
});