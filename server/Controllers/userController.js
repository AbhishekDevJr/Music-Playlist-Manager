const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PlaylistModel = require('../Models/playlist');

exports.index = asyncHandler(async (req, res, next) => {

    const allUsers = await UserModel.find();

    res.json({
        route: '/user',
        title: 'User Route',
        msg: 'User Routes Response',
        method: 'GET'
    });
});

//User Register Controller
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

//User Auth Controller
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

//Controller that manages Playlist Creation
exports.createPlaylist = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const currUserName = decoded?.email;
        if (req?.body?.title && currUserName) {
            const userObj = await UserModel.findOne({ email: currUserName });

            const userPlaylists = await PlaylistModel.find({ createdBy: userObj?.id });

            if (userPlaylists?.some((item) => item.title === req?.body?.title)) {
                res.status(200).json({
                    title: 'Playlist Exists',
                    msg: 'Playlist with this title already exists.'
                });
            }
            else {
                const newPlaylist = new PlaylistModel({
                    title: req?.body?.title,
                    description: req?.body?.description,
                    createdBy: userObj?._id,
                    createdAt: Date.now(),
                    songs: req?.body?.songs
                });

                newPlaylist.save();

                res.status(200).json({
                    title: 'Playlist Created',
                    msg: 'Playlist successfully created.'
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

//Controller that Retrieves Playlist Data
exports.getPlaylists = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const currUserName = decoded?.email;

        if (currUserName) {
            const userObj = await UserModel.findOne({ email: currUserName });
            const userPlaylists = await PlaylistModel.find({ createdBy: userObj?.id });

            res.status(200).json({
                title: 'Total Playlists',
                msg: 'Total Playlists for Current User',
                email: currUserName,
                playlists: userPlaylists,
            });
        }
        else {
            res.status(400).json({
                title: 'Bad Request',
                msg: 'Bad Request Payload',
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

//Controller that Manages Playlist Record Deletion
exports.deletePlaylist = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const currUserName = decoded?.email;

        if (currUserName && req?.body?.title) {
            const userObj = await UserModel.findOne({ email: currUserName });

            const playlistDel = await PlaylistModel.findOneAndDelete({ createdBy: userObj?._id, title: req?.body?.title });

            if (playlistDel) {
                res.status(200).json({
                    title: 'Playlist Deleted',
                    msg: 'Playlist Successfully Deleted.'
                });
            }
            else {
                res.status(500).json({
                    title: 'Playlist Not Deleted',
                    msg: 'Unable to Delete Playlist or Already Deleted.'
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

//Controller that Manages Playlist Record Updation
exports.editPost = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const currUserName = decoded?.email;

        if (currUserName && req?.body?.title && req?.body?.description && req?.body?._id) {
            const userObj = await UserModel.findOne({ email: currUserName });
            const playlistEdit = await PlaylistModel.findOne({ _id: req?.body?._id });

            if (playlistEdit) {
                playlistEdit.title = req?.body?.title;
                playlistEdit.description = req?.body?.description;

                await playlistEdit.save();

                res.status(200).json({
                    title: 'Playlist Edited',
                    msg: 'Playlist has been Updated.'
                });
            }
            else {
                res.status(200).json({
                    title: 'Playlist Not Found',
                    msg: 'Requested Playlist was not Found'
                });
            }
        }
        else {
            res.status(400).json({
                title: 'Bad Request',
                msg: 'Bad Request Payload'
            });
        }

    } catch (err) {
        res.status(500).json({
            title: `Unhandled Exception`,
            msg: `Unhandled Server Error.`
        });
    }
});

//Controller that manages User Signout
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