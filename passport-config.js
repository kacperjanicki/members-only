const bcrypt = require("bcryptjs");

const localstrategy = require("passport-local").Strategy;

function initialize(passport, findUserByEmail, findUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = findUserByEmail(email);
        if (user) {
            if (user == null) {
                return done(null, false, { message: "No user found with that email" });
            }
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Password incorrect" });
                }
            } catch (e) {
                return done(e);
            }
        }
    };

    passport.use(
        new localstrategy(
            {
                usernameField: "email",
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, findUserById(id)));
}

module.exports = initialize;
