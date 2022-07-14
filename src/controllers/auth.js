const models = require('../models/user');
const response = require('../helpers/response');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function token_user(status, email) {
    const payload = {
        email : email,
        role : status
    };

    const access = jwt.sign(payload, process.env.JWT_KEYS, {expiresIn : '1m'});
    const refresh = jwt.sign(payload, process.env.JWT_REFRESH, {expiresIn : '1d'});

    return {
        AccessToken : access,
        RefreshToken : refresh,
        msg: 'token berhasil dibuat'
    };
}

const Login = async (req, res) => {
    try {
        const password_db = await models.getByEmail(req.body.email);
        
        // console.log(password_db);

        if (password_db.length <= 0) {
            return response(res, 200, 'Email tidak terdaftar');
        }

        const password_user = req.body.password;
        const checkPassword = await bcrypt.compare(password_user, password_db[0].password);

        if (checkPassword) {
            const token = token_user(req.params.users, password_db[0].email);
            return response(res, 200, token);
        } else {
            return response(res, 200, 'Password salah');
        }
        
    } catch (error) {
        console.log(error);
    }
};

module.exports = Login;