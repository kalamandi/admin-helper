const sequelize = require('./index');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.BIGINT, primaryKey: true, unique: true, autoIncrement: true },
    vk_id: { type: DataTypes.BIGINT },
    nick: { type: DataTypes.STRING },
    server: { type: DataTypes.INTEGER },
    status: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Server = sequelize.define('server', { 
    id: { type: DataTypes.BIGINT, primaryKey: true, unique: true, autoIncrement: true },
    server: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    peer_id: { type: DataTypes.INTEGER },
    notify: { type: DataTypes.INTEGER, defaultValue: 1 },
    min_admins: { type: DataTypes.INTEGER, defaultValue: 8 }
});

module.exports = { Server, User };