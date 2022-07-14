const express = require('express');
const routers = express.Router();
const ctrl = require('../controllers/movies');
const validate = require('../middleware/validate');
const uploads = require('../middleware/upload');

routers.get('/all', ctrl.GetAll);
routers.get('/:name', ctrl.GetByName);
routers.get('/sort/name', ctrl.SortByName);
routers.get('/sort/release', ctrl.SortByRelease);
routers.post('/create', uploads.single('image'), ctrl.Create);
routers.delete('/:id', validate('admin'), ctrl.Delete);
routers.put('/:id', validate('admin'), ctrl.Update);
routers.patch('/update/:id', validate('admin'), uploads.single('image'), ctrl.UploadImage);
routers.patch('/deleteImage/:id', validate('admin'), ctrl.DeleteImage);

module.exports = routers;
