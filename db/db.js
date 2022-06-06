const knex = require('knex');
const knexfile = require('./knexfile');

const db = knex(knexfile.development)

db.raw("SELECT 1")
    .then(() => {
        console.log('Подключение к базе данных прошло успешно!');
    })
    .catch((e) => {
        console.log('Подключение к базе данных завершилось с ошибкой!');
        console.error(e)
    });

module.exports = db;