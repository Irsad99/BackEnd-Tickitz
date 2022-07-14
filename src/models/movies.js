const db = require('../configs/db');
const format = require('pg-format');
const models = {};

models.getByName = (name) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tickitz.movies m WHERE m.movie_name like $1',[
            name
        ])
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.getByID = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tickitz.movies m WHERE m.movie_id = $1',[
            id
        ])
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.getData = async ({page, limit, order}) => {
    try {
        let query = format('SELECT * FROM tickitz.movies');

        if (order) {
            query = format(query + ' ORDER BY movie_id %s', order);
        }

        if (page && limit) {
            const offset = (page - 1) * limit;
            query = format(query + ' LIMIT %s OFFSET %s', limit, offset);
        }

        const { rows } = await db.query('SELECT COUNT(movie_id) as "count" FROM tickitz.movies');
        const counts = rows[0].count;

        const meta = {
            next:
                page == Math.ceil(counts / limit)
                    ? null
                    : `http://localhost:8080/api/v1/movies/all?order=${order}&page=${Number(page) + 1}&limit=${limit}`,
            prev:
                page == 1
                    ? null
                    : `http://localhost:8080/api/v1/movies/all?order=${order}&page=${Number(page) - 1}&limit=${limit}`,
            counts
        };

        const prods = await db.query(query);
        return { data: prods.rows, meta };
    } catch (error) {
        console.log(error);
    }
};

models.sortByName = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tickitz.movies ORDER BY movie_name DESC')
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                console.log(ers);
                reject(ers);
            });
    });
};

models.sortByRelease = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM tickitz.movies ORDER BY release_date DESC')
            .then((data) => {
                resolve(data.rows);
            })
            .catch((ers) => {
                console.log(ers);
                reject(ers);
            });
    });
};

models.addData = ({name, category, director, casts, release, hour, minute, synopsis, image}) => {
    const updated_at = new Date().toISOString();
    const created_at = new Date().toISOString();

    return new Promise((resolve, reject) => {
        db.query('INSERT INTO tickitz.movies (movie_name, category, director, casts, release_date, duration_hour, duration_minute, synopsis, created_at, updated_at, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [
                name, 
                category, 
                director, 
                casts, 
                release, 
                hour, 
                minute, 
                synopsis,
                created_at,
                updated_at,
                image
            ])
            .then(() => {
                resolve('Data Successfully Saved');
            })
            .catch((ers) => {
                console.log(ers);
                reject(ers);
            });
    });
};

models.deleteData = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tickitz.movies WHERE movie_id= $1', [
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

models.updateData = (id, name, release) => {
    const updated_at = new Date().toISOString();

    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.movies SET movie_name= $2, release_date= $3, updated_at = $4 WHERE movie_id= $1', [
            id,
            name,
            release,
            updated_at
        ])
            .then(() => {
                resolve('Data Successfully Updated');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.updateImage = (id,image) => {
    const updated_at = new Date().toISOString();
    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.movies SET image= $2, updated_at = $3 WHERE movie_id= $1', [
            id,
            image,
            updated_at
        ])
            .then(() => {
                resolve('Data Successfully Updated');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.deleteImage = (id, remove) => {
    const updated_at = new Date().toISOString();
    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.movies SET image= $2, updated_at = $3 WHERE movie_id= $1', [
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
