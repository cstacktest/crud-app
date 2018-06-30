//dummy function

var authenticate = function (req, res, next) {
    // code to authenticate the user
    // if authorised successfully attach user object to the request object
    req.user = {"id":"user1"};
    next();

    // if authorision fails then send auth error 401
    // res.status(401).send({});
}

module.exports = { authenticate }
