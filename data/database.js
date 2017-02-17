const Sequelize = require("sequelize");

class Database {
    constructor() {
        this._sequelize = new Sequelize(gConfig.database.database, gConfig.database.user, gConfig.database.password, {
            host: gConfig.database.host,
            dialect: gConfig.database.type,

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

            // SQLite only
            storage: gConfig.database.storage
        });
    }

    authenticate() {
        this._sequelize
            .authenticate()
            .then(function(err) {
                console.log('Connection has been established successfully.');
            })
            .catch(function (err) {
                console.log('Unable to connect to the database:', err);
            });
    }
}

module.exports = Database;