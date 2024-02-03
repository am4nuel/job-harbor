const express = require("express");
const app = express();
const db = require("./models");

const cors = require("cors");
const mainRouter = require("./Router/MainRouter");
app.use(express.json());
app.use(cors());
const session = require("express-session");
const SequelizeStore = require("express-session-sequelize")(session.Store);

const sessionStore = new SequelizeStore({
  db: db.sequelize, // Your Sequelize instance
});

app.use(
  session({
    secret: generateUniqueId(),
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

app.use("/register", mainRouter);
app.get("/", (req, res) => {
  res.send("hello World");
});
function generateUniqueId() {
  // Generate a random number and convert it to a string
  const randomPart = Math.random().toString(36).substring(2, 10);

  // Get the current timestamp and convert it to a string
  const timestampPart = new Date().getTime().toString(36);

  // Concatenate the random and timestamp parts to create a unique ID
  const uniqueId = randomPart + timestampPart;

  return uniqueId;
}

// const { faRetweet } = require("@fortawesome/free-solid-svg-icons");
db.sequelize.sync().then(() => {
  app.listen("3001", () => {
    console.log("hello niga");
  });
});
