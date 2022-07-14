const response = require('../helpers/response');
const jwt = require('jsonwebtoken');

const validate = (roles) => {

    return [
        (req, res, next) => {

            const { access_token, refresh_token } = req.headers;

            if (refresh_token) {
                jwt.verify(refresh_token, process.env.JWT_REFRESH, (err, decode) => {
                    if (err) {
                        return response(res, 401, err);
                    }
                    req.auth = decode;
        
                    if (req.auth.role === roles) {
                        next();
                    } else {
                        if (req.auth.role === 'admin') {
                            next();
                        }
                        else {
                            return response(res, 401, 'Mohon maaf anda bukan admin');
                        }
                    }
                }); 
            } else if (access_token) {
                jwt.verify(access_token, process.env.JWT_KEYS, (err, decode) => {
                    if (err) {
                        return response(res, 401, err);
                    }
                    req.auth = decode;
        
                    if (req.auth.role === roles) {
                        next();
                    } else {
                        if (req.auth.role === 'admin') {
                            next();
                        }
                        else {
                            return response(res, 401, 'Mohon maaf anda bukan admin');
                        }
                    }
                }); 
            } else {
                return response(res, 401, { msg: 'Silahkan login dulu' });
            }
        }
    ];
};


module.exports = validate;