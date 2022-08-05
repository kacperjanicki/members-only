const JWT = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({
            errors: [
                {
                    msg: "No token found",
                },
            ],
        });
    }
    try {
        let user = await JWT.verify(token, process.env.TOKEN);
        const userObj = await User.find({ email: user.email });
        console.log(userObj);
        req.user = { email: user.email, username: userObj[0].username };
        next();
    } catch (err) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Token invalid",
                },
            ],
        });
    }
};
