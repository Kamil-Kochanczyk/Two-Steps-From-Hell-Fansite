const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UsersDB = sequelize.define('UsersDB', {
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
        tableName: 'UsersDB',
        timestamps: false
    });

    return UsersDB;
};
