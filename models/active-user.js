const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ActiveUser = sequelize.define('ActiveUser', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'ActiveUser',
        timestamps: false
    });

    return ActiveUser;
};
