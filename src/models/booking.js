const db = require('../configs/db');
const format = require('pg-format');
const models = {};

models.getData = async ({page, limit, order}) => {
    try {
        let query = format('SELECT * FROM tickitz.booking');

        if (order) {
            query = format(query + ' ORDER BY booking_id %s', order);
        }

        if (page && limit) {
            const offset = (page - 1) * limit;
            query = format(query + ' LIMIT %s OFFSET %s', limit, offset);
        }

        const { rows } = await db.query('SELECT COUNT(booking_id) as "count" FROM tickitz.booking');
        const counts = rows[0].count;

        const meta = {
            next:
                page == Math.ceil(counts / limit)
                    ? null
                    : `http://localhost:8080/api/v1/bookings/all?order=${order}&page=${Number(page) + 1}&limit=${limit}`,
            prev:
                page == 1
                    ? null
                    : `http://localhost:8080/api/v1/bookings/all?order=${order}&page=${Number(page) - 1}&limit=${limit}`,
            counts
        };

        const prods = await db.query(query);
        return { data: prods.rows, meta };
    } catch (error) {
        console.log(error);
    }
};

models.addData = (date, time, total_cost, name_card, card_number, id_movie, id_schedule, id_user, seats) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO tickitz.booking (date, time, total_cost, name_card, card_number, id_movie, id_schedule, id_user, seats) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [
                date, 
                time, 
                total_cost, 
                name_card, 
                card_number, 
                id_movie, 
                id_schedule, 
                id_user, 
                seats
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
        db.query('DELETE FROM tickitz.booking WHERE booking_id = $1', [
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

models.updateData = (id, name_card, card_number) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE tickitz.booking SET "name_card"= $2, "card_number" = $3 WHERE booking_id= $1', [
            id,
            name_card, 
            card_number
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
