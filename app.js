require('dotenv').config();
const express = require('express');
const paginate = require('express-paginate');
const route = require('./src/routers');
const db = require('./src/configs/db');
const cors = require('cors');

const server = express();
const PORT = 8080;

const whitelist = ['http://localhost:3000', 'http://localhost:8080'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors(corsOptions));
server.use('/api/v1', route);
server.use(paginate.middleware(1, 10));

db.connect()
    .then(() => {
        console.log('Database connected');

        server.listen(PORT, () => {
            console.log(`Service run on port ${PORT}`);
        });
    })
    .catch((er) => {
        console.log(er);
    });
