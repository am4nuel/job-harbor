const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const mainRouter = require("./Router/MainRouter");

const { Works, Requests, ServiceOrder } = require("./models");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
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
io.on("connection", (socket) => {
  // Listen for the user ID when a client connects
  socket.on("setUserId", (userId) => {
    userSockets[userId] = socket.id;
  });

  // Clean up userSockets on disconnection
  socket.on("disconnect", () => {
    const userId = Object.keys(userSockets).find(
      (key) => userSockets[key] === socket.id
    );
    if (userId) {
      delete userSockets[userId];
    }
  });
});
app.post("/setrequests", async (req, res) => {
  const data = await Requests.create(req.body);
  const requestData = await Requests.findAll();
  const userId = req.body.requestedTo;
  if (userId && userSockets[userId]) {
    io.to(userSockets[userId]).emit("newRequest", requestData);
  }
  res.send(data);
});
app.post("/manageorderproject", async (req, res) => {
  const updateData = {
    orderStatus: req.body.orderStatus,
    assignedTo:
      req.body.orderStatus === "Pending" ? req.body.assignedTo : "none",
  };
  const condition = {
    where: {
      id: req.body.orderId,
    },
  };
  await ServiceOrder.update(updateData, condition);
  const userId = req.body.acceptedFor;
  if (updateData.orderStatus === "request sent") {
    console.log(updateData.orderStatus);
    const orderData = await ServiceOrder.findAll();
    io.to(userSockets[userId]).emit("newRequest", orderData);
    res.send(orderData);
  } else if (updateData.orderStatus === "Pending") {
    const orderData = await ServiceOrder.findAll();
    await Requests.update(
      { requestStatus: "accepted" },
      {
        where: {
          orderId: req.body.orderId,
        },
      }
    );
    if (userId && userSockets[userId]) {
      io.to(userSockets[userId]).emit("acceptedRequest", {
        acceptedRequest: req.body.orderId,
        orderData: orderData,
      });
      res.send(orderData);
    }
  } else if (updateData.orderStatus === "ordered") {
    const orderData = await ServiceOrder.findAll();
    await Requests.update(
      { requestStatus: "canceled" },
      {
        where: {
          orderId: req.body.orderId,
        },
      }
    );
    if (userId && userSockets[userId]) {
      io.to(userSockets[userId]).emit("canceledRequest", {
        declinedRequest: req.body.orderId,
        orderData: orderData,
      });
      res.send(orderData);
    }
  }
});

db.sequelize.sync().then(() => {
  http.listen("3001", () => {
    console.log("Server is running on port 3001");
  });
});
