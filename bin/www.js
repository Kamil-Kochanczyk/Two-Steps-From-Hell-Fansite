#!/usr/bin/env node

const UsersDB = require('../apis/users-db');
const CommentsDB = require('../apis/comments-db');
const VotingDB = require('../apis/voting-db');
const ActiveUser = require('../apis/active-user');

const apis = [UsersDB, CommentsDB, VotingDB, ActiveUser];

apis.forEach(async (api) => {
    const isInitialized = await api.isInitialized();

    if (!isInitialized) {
        await api.initialize();
    }
});

const app = require('../app');
const debug = require('debug')('two-steps-from-hell-fansite:server');
const http = require('http');

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
