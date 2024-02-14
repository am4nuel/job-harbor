const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const mainRouter = require("./Router/MainRouter");
const http = require("http");
const socketIo = require("socket.io");
const { Works, Requests } = require("./models");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend origin
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true, // If using credentials (cookies, tokens)
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("client/build"));
const userSockets = {};
const session = require("express-session");
const SequelizeStore = require("express-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({
  db: db.sequelize,
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
function generateUniqueId() {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestampPart = new Date().getTime().toString(36);
  return randomPart + timestampPart;
}

// Initialize Firebase Admin with your service account
// Replace with the desired folder name

app.use(cors());

app.post("/setrequests", async (req, res) => {
  const data = await Requests.create(req.body);
  // Broadcast the inserted data to all connected clients
  io.emit("newRequest", data);

  res.send(data);
});

db.sequelize.sync().then(() => {
  server.listen("3001", () => {
    console.log("Server is running on port 3001");
  });
});
