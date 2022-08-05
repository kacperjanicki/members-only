if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
app.use(express.static(__dirname + "/public"));

app.use(expressLayouts);
app.use(express.json());

app.set("view engine", "ejs");
app.use(cookieParser());
const User = require("./models/user");
const PostModel = require("./models/post");
const post = require("./post.js");

const { check, validationResult, body } = require("express-validator");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));

const JWT = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const activeUser = require("./middleware/activeUser");

app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.set("view engine", "ejs");
app.get("/", activeUser, async (req, res) => {
    let posts = await PostModel.find({});

    res.render("index", { user: req.user, posts: posts });
});

app.get("/join", activeUser, (req, res) => {
    res.render("join", { user: req.user });
});
app.post("/join", activeUser, async (req, res) => {
    try {
        await User.updateOne(
            {
                email: req.user.email,
            },
            { membership_status: true },
            { upsert: true }
        );
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
});

app.use("/posts", post);

app.get("/signup", (req, res) => {
    res.render("signup", { user: req.user, error: false });
});
app.get("/login", activeUser, (req, res) => {
    if (req.user) {
        res.redirect("/");
    } else {
        res.render("login", { user: req.user, error: false });
    }
});
app.post("/login", activeUser, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        let isValid = await bcrypt.compare(req.body.password, user.password);
        if (isValid) {
            const token = await JWT.sign({ email: req.body.email }, process.env.TOKEN, { expiresIn: 360000 });
            res.cookie("token", token);
            res.redirect("/");
        } else {
            return res.render("login", { user: req.user, error: [{ msg: "Failed to log in" }] });
        }
    } catch (e) {
        return res.render("login", { error: "Failed to log in", user: req.user });
    }
});
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

app.post(
    "/signup",
    activeUser,
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password", "Please provide a password that is greater than 5 characters").isLength({ min: 6 }),
    ],
    body("confirm_password").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors.errors);
        if (!errors.isEmpty()) {
            return res.render("signup", { user: req.user, error: errors.errors });
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.render("signup", { user: req.user, error: "This user already exists" });
        } else if (errors.isEmpty() && !user) {
            const token = await JWT.sign({ email: req.body.email }, process.env.TOKEN, { expiresIn: 360000 });
            res.cookie("token", token);
            let hashedPass = await bcrypt.hash(req.body.password, 10);
            const newuser = new User({
                username: req.body.username,
                password: hashedPass,
                email: req.body.email,
            });
            try {
                await newuser.save();
                res.redirect("/");
            } catch (err) {
                console.error(err);
            }
        }
    }
);

app.listen(process.env.PORT || 3200);
