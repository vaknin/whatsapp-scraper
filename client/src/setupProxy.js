const proxy = require('http-proxy-middleware');

function proxify(app){
    app.use(proxy('/*', {target: 'http://localhost:5000'}));
}

module.exports = proxify;