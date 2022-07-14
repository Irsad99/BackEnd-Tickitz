const models = require('../models/user');
const response = require('../helpers/response');
const HashPass = require('../helpers/hash');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const users = {};

const schema = Joi.object().keys({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    phone: Joi.number().min(6).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
});

const removeImage = (filepath) => {
    const filePath = path.join(__dirname, '../..', filepath);
    fs.unlink(filePath, data => data);
};

users.getAll = async (req, res) => {
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

users.GetTicket = async (req,res) => {
    try {
        const id = req.params.id;

        const getUsers = await models.getByID(id);
        if (getUsers.length <= 0){
            return response(res, 404, 'User Tidak Ada');
        }

        const data = await models.ticket(id);
        if (data.length <= 0) {
            return response(res, 200, 'User belum booking');
        } else {
            return response(res, 200, data);
        }
        
    } catch (error) {
        return response(res, 500, error);
    }
};

users.Create = async (req, res) => {
    try {

        const { firstname, lastname, phone, email, password } = req.body;
        const validator = Joi.validate(
            { 
                firstname: firstname, 
                lastname: lastname, 
                phone: phone, 
                email: email, 
                password: password
            }, schema, function (err) {
                return err;
            });
            
        if (validator !== null){
            const { message } = validator.details[0];
            return response(res, 404, message);
        } 

        let image = '';
        if (req.file !== undefined) {
            image = req.file.path;
        }else {
            return response(res, 400, 'Cannot be empty and Only .png .jpeg .jpg format');
        } 
        
        const lowerEmail = email.toLowerCase();
        const hashPassword = await HashPass(password);
        const getEmail = await models.getByEmail(lowerEmail);

        if (getEmail.length == 1) {
            return response(res, 200, 'Email sudah terdaftar');
        }
        
        const data = await models.addData({ firstname, lastname, phone, lowerEmail, hashPassword, image });
        return response(res, 200, data);
    } catch (error) {
        console.log(error);
        res.send('Maaf error terjadi');
    }
};

users.ChangePassword = async (req,res) => {
    try {
        const id = req.params.id;
        const password_db = await models.getByID(id);
        if (password_db.length <= 0) {
            return response(res, 200, 'User tidak terdaftar');
        }

        const {passwordLama, passwordBaru, konfirmasi} = req.body;
        const checkPassword = await bcrypt.compare(passwordLama, password_db[0].password);

        if (!passwordLama || !passwordBaru || !konfirmasi) {
            return response(res, 200, 'Harap isi semua kolom');
        } else if (!checkPassword) {
            return response(res, 200, 'Password lama salah');
        } else if (konfirmasi !== passwordBaru) {
            return response(res, 200, 'Konfirmasi password salah');
        } else {
            const hashPassword = await HashPass(passwordBaru);
            const data = await models.changePassword(id, hashPassword);
            return response(res, 200, data);
        }
        
    } catch (error) {
        return response(res, 500, error);
    }
};

users.Delete = async (req,res) => {
    try {
        const id = req.params.id;
        // Remove Image
        const getUsers = await models.getByID(id);
        if (getUsers.length <= 0){
            return response(res, 404, 'User Tidak Ada');
        }

        if (getUsers[0].image != null){
            removeImage(getUsers[0].image);
        }

        // Remove Data Movie
        const data = await models.deleteData(id);
        return response(res, 200, data);
    } catch (error) {
        console.log(error);        
        return response(res, 500, error);
    }
};

users.UploadImage = async (req,res) => {
    try {
        const id = req.params.id;

        // Remove Image
        const getUsers = await models.getByID(id);
        if (getUsers.length <= 0){
            return response(res, 404, 'User Tidak Ada');
        }

        if (getUsers[0].image != null){
            removeImage(getUsers[0].image);
        }

        let image = '';
        if (req.file !== undefined) {
            image = req.file.path;
        } else {
            return response(res, 400, 'Cannot be empty and Only .png .jpeg .jpg format');
        }
        const data = await models.updateImage(id, image);
        return response(res, 200, data);
    } catch (error) {
        console.log(error);
        return response(res, 500, error);
    }
};

users.DeleteImage = async (req,res) => {
    try {
        const id = req.params.id;
        // Remove Image
        const getUsers = await models.getByID(id);
        if (getUsers.length <= 0){
            return response(res, 404, 'User Tidak Ada');
        }

        const remove = removeImage(getUsers[0].image);
        const data = await models.deleteImage(id, remove);
        return response(res, 200, data);
    } catch (error) {
        return response(res, 500, error);
    }
};

module.exports = users;