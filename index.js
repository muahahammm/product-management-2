const express = require('express');
const path = require("path");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");
require("dotenv").config();
// Socket.io
const http = require('http');
const { Server } = require("socket.io");
// ENd socket.io

const database = require("./config/database.js");
const systemConfig = require("./config/system.js");

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// Socket.io
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
// End socket.io

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Express flash
app.use(cookieParser("jhfuhubbeqb"));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End express flash

// Tiny mce
app.use('/tinymce', express.static(path.join(__dirname, "node_modules", "tinymce")));
// End tiny mce

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//routes
routeAdmin(app);
route(app);
app.use((req, res) => {
    res.status(404).render("client/pages/errors/404", {
        pageTitle: "404 not found"
    });
});

server.listen(port);