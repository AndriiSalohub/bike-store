require("./db/db");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
const statsRoutes = require("./routes/statsRouter");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("", authRoutes);
app.use("", bikeRoutes);
app.use("", statsRoutes);

app.get("/session", (req, res) => {
  if (req.session.user) {
    return res.send({
      loggedIn: true,
      user: req.session.user,
    });
  } else {
    return res.send({ loggedIn: false });
  }
});

module.exports = app;
