const express = require('express');
const routers = express.Router();
const ctrl = require('../controllers/booking');
const validate = require('../middleware/validate');

routers.get('/all', validate('admin'), ctrl.getAll);
routers.post('/', validate('user'), ctrl.Create);
routers.delete('/:id', validate('user'), ctrl.Delete);
routers.put('/:id', validate('user'), ctrl.Update);

module.exports = routers;