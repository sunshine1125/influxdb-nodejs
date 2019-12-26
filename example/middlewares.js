const client = require('./schema');
const _ = require('lodash');

const checkDatabase = (req, res, next) => {
    client.showDatabases()
        .then(database => {
            if (!database.includes('myTest')) {
                return createDatabase();
            }
        })
        .catch(console.error);
    next();
};

const createDatabase = () => {
    client.createDatabase()
        .then(() => console.info('create database success'))
        .catch(err => console.error(`create database fail, ${err.message}`));
};

const checkRetentionPolicies = (req, res, next) => {
    let arr = [];
    client.showRetentionPolicies()
        .then((retentionPolicies) => {
            _.forEach(retentionPolicies, (value) => {
                arr.push(value.name);
            });
            if (!arr.includes('myTest')) {
                return createRetentionPolicy();
            }
        })
        .catch(console.error);
    next();
};

const createRetentionPolicy = () => {
    client.createRetentionPolicy('myTest', '1h')
        .then(() => console.info('create retention policy success'))
        .catch(err => console.error(`create retention policy fail, ${err}`));
};

module.exports = [checkDatabase, checkRetentionPolicies];