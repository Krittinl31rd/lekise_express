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

// Sync models with the database
// sequelize.sync() // Set force: true to drop and recreate tables
//     .then(() => {
//         console.log('Database synced successfully');
//     })
//     .catch(err => {
//         console.log('Error syncing database: ', err);
//     });
// Middleware to extract the subdomain (vendor)
/*app.use((req, res, next) => {
    const host = req.headers.host.split('.');
    req.vendor = host.length > 2 ? host[0] : null;  // "vender1" in vender1.streetlight.com
    next();
});*/

//Get sub Domain
// app.use((req, res, next) => {
//     const host = req.headers.host.split('.');
//     console.log(req.headers.host);
//     console.log(host[0]);
//     if (host[0] !== 'localhost' && host.length > 1) {
//         //req.vendor = host[0]; // "vender1" in vender1.streetlight.com
//         req.vendorreq = host[0]; // "vender1" in vender1.streetlight.com
//     } else {
//         req.vendorreq = null;
//     }

//     console.log(req.vendorreq);

//     next();
// });
// Route handler for vendor-specific login
/*app.get('/login', (req, res) => {

    if (!req.vendorreq) {
        return res.status(400).send("Invalid URL: Vendor subdomain is required.");
    }

    let vender = venderSiteList.find(x => x.subdomain == req.vendorreq.toString().toLowerCase())
    if (vender != undefined) {
        res.send(`<p style="font-size:56px;text-align: center;margin-top:56px;">Login page for ${vender.name}</p>`);
    }
    else {
        return res.status(400).send("Invalid URL: Vendor subdomain is invalid.");
    }
    // Render a login page specific to the vendor
});*/

readdirSync("./routes/api/").map((c) => {
    app.use(process.env.URL_API, require("./routes/api/" + c))
});

readdirSync("./routes/pages/").map((c) => {
    app.use(require("./routes/pages/" + c))
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running on port " + port));

////////////////////////////////////////////////////////////////////////////////////////////////////////
// const venderSiteList = [
//     {
//         name: 'Archi-tronic',
//         subdomain: 'archi',
//         appearance: {
//             logo: 'archi_logo.png',
//             background: 'archi_cover.png'
//         }
//     },
//     {
//         name: 'Nottingham',
//         subdomain: 'ham',
//         appearance: {
//             logo: 'ham_logo.png',
//             background: 'ham_cover.png'
//         }
//     },
//     {
//         name: 'Gideon Crop',
//         subdomain: 'gideon',
//         appearance: {
//             logo: 'gideon_logo.png',
//             background: 'gideon_cover.png'
//         }
//     },
// ]