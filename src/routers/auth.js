const express = require('express');
const routers = express.Router();
const Login = require('../controllers/auth');

routers.post('/:users', Login);

module.exports = routers;