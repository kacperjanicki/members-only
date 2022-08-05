const JWT = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        let user = await JWT.verify(token, process.env.TOKEN);
        const userObj = await User.find({ email: user.email });
        req.user = userObj[0];
        next();
    } catch (e) {
        next();
    }
};
