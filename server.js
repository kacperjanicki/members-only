//if working with inputs:
//	const bodyParser = require('body-parser');
//	app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express"); //npm i express ejs express-ejs-layouts
const app = express();
// const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.render("index");
});

app.listen(process.env.PORT || 3200);
