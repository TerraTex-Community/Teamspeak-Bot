/**
 * Created by C5217649 on 17.02.2017.
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("User", {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        UniqueId: {
            type: DataTypes.STRING,
            unique: true
        },
        Registered: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        LastNickname: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        LastLogin: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        timestamps: true
    });
};
