const authRoutes = require('./auth');
const userRoutes = require('./user');
const boardRoutes = require('./board');

module.exports = app => {
    app.get('/', (req, res) => {
        res.status(200).send({ message: "Welcome to the AUTHENTICATION API. Register or Login to test Authentication."});
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/board', boardRoutes);

};