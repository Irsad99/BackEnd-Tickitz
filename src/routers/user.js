const express = require('express');
const routers = express.Router();
const ctrl = require('../controllers/user');
const validate = require('../middleware/validate');
const uploads = require('../middleware/upload');

routers.get('/all',validate('admin') , ctrl.getAll);
routers.get('/ticket/:id', validate('user'), ctrl.GetTicket);
routers.post('/register', uploads.single('image'), ctrl.Create);
routers.put('/:id', validate('user'), ctrl.ChangePassword);
routers.delete('/:id', validate('admin'), ctrl.Delete);
routers.patch('/update/:id', validate('user'), uploads.single('image'), ctrl.UploadImage);
routers.patch('/deleteImage/:id', validate('user'), ctrl.DeleteImage);

module.exports = routers;