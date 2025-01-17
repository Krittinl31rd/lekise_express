// hello
require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash=require('express-flash');
const { readdirSync } = require("fs");
const cors = require("cors");
const i18n = require('i18n');
const path = require('path');
const sequelize = require('./config/sequelize');
const { isActiveRoute } = require("./helpers/routeHelpers");

const app = express();

i18n.configure({
    locales: ['en', 'th'], // Add other languages if needed
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'th',
    queryParameter: 'lang', // Language query parameter
    cookie: 'lang', // Language stored in cookies
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        // cookie: {maxAge: new Date(Date.now() + (3600000))}
    })
);
app.use(flash());

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use("/icons", express.static(path.join(__dirname, "node_modules/boxicons")));

// Middleware to set locale from query or cookies
app.use(i18n.init);
app.use((req, res, next) => {
    const lang = req.query.lang || req.cookies.lang || i18n.getLocale();
    res.cookie('lang', lang);
    i18n.setLocale(lang);
    res.locals.__ = i18n.__;
    res.locals.i18n = i18n;
    next();
});


// Templating
app.use(expressLayout);
app.set("layout", "./layouts/admin");
// set EJS templare engine
app.set('views', './views')
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

readdirSync("./routes/api/").map((c) => {
    app.use(process.env.URL_API, require("./routes/api/" + c))
});

readdirSync("./routes/pages/").map((c) => {
    app.use(require("./routes/pages/" + c))
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port " + port));

