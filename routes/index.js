'use strict'

// Add access to the app and db objects to each route
module.exports = function router(app, db) {
    require('./Users')(app, db);
    require('./Bots')(app, db);
};