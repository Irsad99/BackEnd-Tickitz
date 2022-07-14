const models = require('../models/movies');
const response = require('../helpers/response');
const path = require('path');
const fs = require('fs');
const movies = {};

const removeImage = (filepath) => {
    const filePath = path.join(__dirname, '../..', filepath);
    fs.unlink(filePath, data => data);
};

movies.GetAll = async (req, res) => {
    try {
        const query = {
            page : req.query.page || 1,
            limit : req.query.limit || 5,
            order : req.query.order
        };
        const {data, meta} = await models.getData(query);
        return response(res, 200, data, meta);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.GetByName = async (req,res) => {
    try {
        const name = req.params.name;
        const data = await models.getByName(name);
        if (!data.length) {
            return response(res, 404, 'Sorry Data Was Not Found');
        } else {
            return response(res, 200, data);
        }
        
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.SortByName = async (req, res) => {
    try {
        const data = await models.sortByName();
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.SortByRelease = async (req, res) => {
    try {
        const data = await models.sortByRelease();
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.Create = async (req, res) => {
    try {
        let image = '';
        if (req.file !== undefined) {
            image = req.file.path;
        } else {
            return response(res, 400, 'Cannot be empty and Only .png .jpeg .jpg format');
        }
        const { name, category, director, casts, release, hour, minute, synopsis} = req.body;
        const data = await models.addData({name, category, director, casts, release, hour, minute, synopsis, image});
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.Delete = async (req,res) => {
    try {
        const id = req.params.id;
        // Remove Image
        const getData = await models.getByID(id);
        if (getData.length <= 0){
            return response(res, 404, 'Movie Tidak Ada');
        }

        removeImage(getData[0].image);

        // Remove Data Movie
        const data = await models.deleteData(id);
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.Update = async (req,res) => {
    try {
        const {name, release} = req.body;
        const id = req.params.id;
        const data = await models.updateData(id, name, release);
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.UploadImage = async (req,res) => {
    try {
        const id = req.params.id;

        // Remove Image
        const getData = await models.getByID(id);
        if (getData.length <= 0){
            return response(res, 404, 'Movie Tidak Ada');
        }

        if (getData[0].image != null){
            removeImage(getData[0].image);
        }

        let image = '';
        if (req.file !== undefined) {
            image = req.file.path;
        }else {
            return response(res, 400, 'Cannot be empty and Only .png .jpeg .jpg format');
        }
        const data = await models.updateImage(id, image);
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

movies.DeleteImage = async (req,res) => {
    try {
        const id = req.params.id;
        // Remove Image
        const getData = await models.getByID(id);
        if (getData.length <= 0){
            return response(res, 404, 'Movie Tidak Ada');
        }

        const remove = removeImage(getData[0].image);
        const data = await models.deleteImage(id, remove);
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

module.exports = movies;
