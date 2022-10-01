const Sequelize = require('sequelize');

const sequelize = new Sequelize('guild', 'user', '0000', {
    host: 'localhost',
    logging: false,
    dialect: 'sqlite',
    storage: '../guild.sqlite',
    define: {
        freezeTableName: true,
        updatedAt: false,
        createdAt: false
    }
});

const guild_basic = sequelize.define('guild_basic', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING
    },
    name: Sequelize.STRING,
    lang: {
        type: Sequelize.STRING,
        defaultValue: 'en-US'
    },

    Warns: Sequelize.STRING,
    Warn_Action: Sequelize.STRING,
    Mod_logs: Sequelize.STRING,
    PermissionsSecurity: Sequelize.STRING,
    PermissionsSecurityRole: Sequelize.STRING,
    PermissionsModeration: Sequelize.STRING,
    PermissionsModerationRole: Sequelize.STRING
});

module.exports = guild_basic;