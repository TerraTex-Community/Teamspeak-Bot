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

    authenticate(callback) {
        this._sequelize
            .authenticate()
            .then(function () {
                console.info('Connection has been established successfully.');
                callback();
            })
            .catch(function (err) {
                callback(err);
                console.error('Unable to connect to the database:', err);
            });
    }
    
    loadModels(callback) {
        this._tableChannelStatistics = this._sequelize.import(__dirname + "/models/ChannelStatistics");
        this._sequelize.sync()
            .then(success => {callback(null, success)})
            .catch(err => {callback(err, null)});
    }

    get tableChannelStatistics() {
        return this._tableChannelStatistics;
    }
}
module.exports = Database;