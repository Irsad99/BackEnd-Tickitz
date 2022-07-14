const db = require('../configs/db');
const format = require('pg-format');
const models = {};

models.getData = async ({page, limit, order}) => {
    try {
        let query = format('SELECT * FROM tickitz.users');

        if (order) {
            query = format(query + ' ORDER BY user_id %s', order);
        }

        if (page && limit) {
            const offset = (page - 1) * limit;
            query = format(query + ' LIMIT %s OFFSET %s', limit, offset);
        }

        const { rows } = await db.query('SELECT COUNT(user_id) as "count" FROM tickitz.users');
        const counts = rows[0].count;

        const meta = {
            next:
                page == Math.ceil(counts / limit)
                    ? null
                    : `http://localhost:8080/api/v1/users/all?order=${order}&page=${Number(page) + 1}&limit=${limit}`,
            prev:
                page == 1
                    ? null
                    : `http://localhost:8080/api/v1/users/all?order=${order}&page=${Number(page) - 1}&limit=${limit}`,
            counts
        };

        const prods = await db.query(query);
        return { data: prods.rows, meta };
    } catch (error) {
        console.log(error);
    }
};

models.ticket = function (id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT u.firstname , u.lastname , m.movie_name, b."date" , b."time" , m.category , b.total_cost, b.seats, (cast(b.total_cost as int) * cast(s.price as int)) as price , s.premiere , s."location" FROM tickitz.users u , tickitz.booking b , tickitz.movies m , tickitz.schedule s where u.user_id  = $1 and u.user_id = b.id_user and m.movie_id = b.id_movie and s.schedule_id = b.id_schedule', [id])
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                console.log(ers);
                reject(ers);
            });
    });
};

models.getByEmail = function (email) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tickitz.users WHERE email = $1', [email])
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                console.log(ers);
                reject(ers);
            });
    });
};

models.getByID = function (id) {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tickitz.users WHERE user_id = $1', [id])
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                console.log(ers);
                reject(ers);
            });
    });
};

models.addData = function ({firstname, lastname, phone, lowerEmail, hashPassword, image}) {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO tickitz.users (firstname, lastname, phone, email, "password", created_at, updated_at, image) VALUES($1, $2, $3, $4, $5, now(), now(), $6)',
            [firstname, lastname, phone, lowerEmail, hashPassword, image]
        )
            .then(() => {
                resolve('Data berhasil disimpan');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.changePassword = (id, hashPassword) => {
    const updated_at = new Date().toISOString();

    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.users SET password = $2, updated_at = $3 WHERE user_id= $1', [
            id,
            hashPassword,
            updated_at
        ])
            .then(() => {
                resolve('Password Successfully Updated');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.deleteData = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tickitz.users WHERE user_id= $1', [
            id
        ])
            .then(() => { 
                resolve('Data Successfully Deleted');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.updateImage = (id, image) => {
    const updated_at = new Date().toISOString();
    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.users SET image= $2, updated_at = $3 WHERE user_id= $1', [
            id,
            image,
            updated_at
        ])
            .then(() => {
                resolve('Image Successfully Updated');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.deleteImage = (id, remove) => {
    const updated_at = new Date().toISOString();
    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.users SET image= $2, updated_at = $3 WHERE user_id= $1', [
            id,
            remove,
            updated_at
        ])
            .then(() => {
                resolve('Delete Image Success!');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

module.exports = models;