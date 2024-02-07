const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { Sequelize } = require('sequelize');

const indexRouter = require('./routes/index');
const signUpServiceRouter = require('./routes/sign-up-service');
const sessionServiceRouter = require('./routes/session-service');

const app = express();

const sequelize = new Sequelize({
    dialect: 'mysql',
    username: 'kamil',
    password: 'kamil',
    database: 'tsfhfansite',
    host: 'localhost',
});

const models = {
    UsersDB: require('./models/users-db')(sequelize),
    ActiveUser: require('./models/active-user')(sequelize)
};

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully');
        await sequelize.sync();
        console.log('Database synchronized');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

app.use((req, res, next) => {
    req.sequelize = sequelize;
    req.models = models;
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sign-up-service', signUpServiceRouter);
app.use('/session-service', sessionServiceRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
