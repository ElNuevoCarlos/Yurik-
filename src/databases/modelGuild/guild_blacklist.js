const Sequelize = require('sequelize');

const sequelize = new Sequelize('guild', 'user', '0000', {
    host: 'localhost',
    logging: false,
    dialect: 'sqlite',
    storage: 'guild.sqlite',
    define: {
        freezeTableName: true,
        updatedAt: false,
        createdAt: false
    }
});

const guild_blacklist = sequelize.define('guild_blacklist', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING
    },
    reason: Sequelize.STRING
});

module.exports = guild_blacklist;