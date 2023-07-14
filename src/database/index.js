const Sequelize = require('sequelize');
const db = require('../config/database.js');
const User = require('../models/User.js');
const Address = require('../models/Address.js');

const connection = new Sequelize(db);

User.init(connection);
Address.init(connection);


Address.associate(connection.models)
User.associate(connection.models)


module.exports = connection;