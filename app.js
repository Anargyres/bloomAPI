const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const eventsRouter = require('./routes/events');
const imagesRouter = require('./routes/images');
const ticketsRouter = require('./routes/tickets');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const managersRouter = require('./routes/managers');
const paiementRouter = require('./routes/paiement');
const promotionalCodeRouter = require('./routes/promotionalCode');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://heroku_vp777cjl:7lulpkjnb6f2d54r80u1srlpq8@ds339177.mlab.com:39177/heroku_vp777cjl', { useNewUrlParser: true});

app.use('/', indexRouter);
app.use('/events', eventsRouter);
app.use('/tickets', ticketsRouter);
app.use('/images', imagesRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/managers', managersRouter);
app.use('/paiement', paiementRouter);
app.use('/promotionalCode', promotionalCodeRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
