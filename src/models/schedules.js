const db = require('../configs/db');
const format = require('pg-format');
const models = {};

models.getData = async ({page, limit, order}) => {
    try {
        let query = format('SELECT * FROM tickitz.schedule');

        if (order) {
            query = format(query + ' ORDER BY schedule_id %s', order);
        }

        if (page && limit) {
            const offset = (page - 1) * limit;
            query = format(query + ' LIMIT %s OFFSET %s', limit, offset);
        }

        const { rows } = await db.query('SELECT COUNT(schedule_id) as "count" FROM tickitz.schedule');
        const counts = rows[0].count;

        const meta = {
            next:
                page == Math.ceil(counts / limit)
                    ? null
                    : `http://localhost:8080/api/v1/schedules/all?order=${order}&page=${Number(page) + 1}&limit=${limit}`,
            prev:
                page == 1
                    ? null
                    : `http://localhost:8080/api/v1/schedules/all?order=${order}&page=${Number(page) - 1}&limit=${limit}`,
            counts
        };

        const prods = await db.query(query);
        return { data: prods.rows, meta };
    } catch (error) {
        console.log(error);
    }
};

models.addData = (id, price, premiere, location, date_start, date_end, time) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO tickitz.schedule (id_movie, price, premiere, location, date_start, date_end, time) VALUES($1, $2, $3, $4, $5, $6, $7)',
            [
                id, price, premiere, location, date_start, date_end, time
            ])
            .then(() => {
                resolve('Data Successfully Saved');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

models.deleteData = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tickitz.schedule WHERE schedule_id = $1', [
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

models.updateData = (id, price) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.schedule SET "price"= $2 WHERE schedule_id= $1', [
            id,
            price,
        ])
            .then(() => {
                resolve('Data Successfully Updated');
            })
            .catch((ers) => {
                reject(ers);
            });
    });
};

module.exports = models;
