require("./db/db");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const bikeRoutes = require("./routes/bikeRoutes");
const statsRoutes = require("./routes/statsRouter");
const typeRoutes = require("./routes/typeRoutes");
const brandRoutes = require("./routes/brandRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const filtersRoutes = require("./routes/filtersRoutes");
const searchRoutes = require("./routes/searchRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const featureRoutes = require("./routes/featureRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
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
app.use("", typeRoutes);
app.use("", brandRoutes);
app.use("", reportsRoutes);
app.use("", filtersRoutes);
app.use("", searchRoutes);
app.use("", cartRoutes);
app.use("", orderRoutes);
app.use("", promotionRoutes);
app.use("", featureRoutes);

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
