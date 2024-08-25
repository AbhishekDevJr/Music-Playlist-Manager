const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.index = asyncHandler(async (req, res, next) => {

    const allUsers = await UserModel.find();

    res.json({
        route: '/user',
        title: 'User Route',
        msg: 'User Routes Response',
        method: 'GET'
    });
});

exports.register = asyncHandler(async (req, res, next) => {
    try {
        if (req?.body?.firstName && req?.body?.lastName && req?.body?.email && req?.body?.password) {
            const userExists = await UserModel.findOne({ email: req?.body?.email });

            if (userExists) {
                res.json({
                    title: 'User Exists',
                    msg: `${req?.body?.email} User already Exists.`
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(req?.body?.password, salt);
                const newUser = new UserModel({ ...req?.body, password: hashedPass, createdAt: new Date() });
                newUser.save();

                res.json({
                    title: 'User Registered',
                    msg: `${req?.body?.email} User Registered. Redirecting to Login Page.`
                });
            }
        }
        else {
            res.status(400).json({
                title: 'Bad Request',
                msg: 'Bad Request Payload.'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            title: 'Unhandled Exception',
            msg: `Unhandled Server Error. ${err?.message}`
        });
    }
});

exports.signin = asyncHandler(async (req, res, next) => {
    try {
        if (req?.body?.email && req?.body?.password) {
            const userExists = await UserModel.findOne({ email: req?.body?.email });

            if (userExists) {
                const isPasswordCorrect = await bcrypt.compare(req?.body?.password, userExists?.password);

                if (isPasswordCorrect) {
                    const token = jwt.sign({ email: userExists?.email, firstName: userExists?.firstName, lastName: userExists?.lastName }, process.env.JWT_KEY, { expiresIn: '1H' });

                    res.status(200).cookie('token', token, {
                        path: '/',
                        sameSite: 'lax',
                        httpOnly: true,
                        secure: false,
                        maxAge: 24 * 60 * 60 * 1000
                    }).json({
                        title: 'Authentication Successful',
                        msg: 'User Successfully Authenticated.',
                    });
                }
                else {
                    res.json({
                        title: 'Authentication Failed',
                        msg: 'Incorrect Password.'
                    });
                }
            }
            else {
                res.json({
                    title: 'User Not Exists',
                    msg: `${req?.body?.email} Does Not Exists.`
                });
            }
        } else {
            res.status(400).json({
                title: 'Bad Request',
                msg: 'Bad Request Payload.'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            title: 'Unhandled Exception',
            msg: `Unhandled Server Error. ${err?.message}`
        });
    }
});

exports.signout = asyncHandler(async (req, res, next) => {
    try {
        const jwtToken = req?.cookies.token;

        if (jwtToken) {
            res.clearCookie('token', {
                path: '/',
                sameSite: 'none',
                secure: true,
            });
            res.status(200).json({
                title: `Logged Out`,
                msg: `Logged Out Successfully.`
            });
        } else {
            res.status(400).json({
                title: `Bad Request`,
                msg: `Bad Request Payload.`
            });
        }

    } catch (err) {
        res.status(500).json({
            title: `Unhandled Exception`,
            msg: `Unhandled Server Error.`
        });
    }
});