if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"); //npm i express ejs express-ejs-layouts
const app = express();
const User = require("./models/user");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    try {
        await user.save();
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
});

app.listen(process.env.PORT || 3200);
