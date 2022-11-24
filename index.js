import express from "express";
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
// import SpazaSuggest from "./spaza-suggest.js";
import flash from "express-flash";
import session from "express-session";
import pgPromise from 'pg-promise';
const app = express();
const pgp = pgPromise({});

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/salon_bookings';

const config = {
    connectionString
}

if(process.env.NODE_ENV === "production"){
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = pgp(config);
// const spaza = SpazaSuggest(db);

app.use(session({
    secret: "admin",
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: "strict"
    }
}));


app.engine("handlebars", exphbs.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));
app.use(flash());

app.get("/", async (req, res) => {
    res.render("index");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("App started on port 3000");
});
