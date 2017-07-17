/**
 * Created by C5217649 on 17.02.2017.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("ChannelStatistics", {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ChannelID: {
            type: DataTypes.BIGINT
        },
        UserCount: DataTypes.INTEGER,
        UserCountWithChilds: DataTypes.INTEGER
    }, {
        timestamps: true
    });
};
