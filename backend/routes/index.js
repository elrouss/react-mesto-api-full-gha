const router = require('express').Router();

const routeSignup = require('./signup');
const routeSignin = require('./signin');

const auth = require('../middlewares/auth');

const routeUsers = require('./users');
const routeCards = require('./cards');

const NotFoundError = require('../errors/NotFoundError');

router.use('/', routeSignup);
router.use('/', routeSignin);

router.use(auth);

router.use('/users', routeUsers);
router.use('/cards', routeCards);

router.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));

module.exports = router;
