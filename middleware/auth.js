const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.send({
        status: false,
        message: 'Access denied.No Token Provided.'
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SIGN);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status.send({
            status: false,
            message: 'Invalid token.'
        });
    }
}