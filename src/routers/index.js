const express = require('express');
const routers = express.Router();

const movies = require('./movies');
const schedules = require('./schedules');
const booking = require('./booking');
const user = require('./user');
const auth = require('./auth');

routers.use('/movies', movies);
routers.use('/schedules', schedules);
routers.use('/bookings', booking);
routers.use('/user', user);
routers.use('/auth', auth);

module.exports = routers;