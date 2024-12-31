const { DataTypes } = require('sequelize');
const sequelize = require('../routes/config');

const Rol = sequelize.define('Rol', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.VARYING(45),
        allowNull: false,
    },
});

module.exports = Rol;
