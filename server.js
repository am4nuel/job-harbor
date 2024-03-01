const express = require("express");
const app = express();
var request = require("request");
const db = require("./models");
const cors = require("cors");
const mainRouter = require("./Router/MainRouter");
var text_ref, phone_Number;
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
app.post("/updateprogress", async (req, res) => {
  const updateData = {
    orderStatus: req.body.progress,
  };
  const condition = {
    where: {
      id: req.body.orderId,
    },
  };
  const orderData = await ServiceOrder.update(updateData, condition);
  const services = await ServiceOrder.findAll();
  const requestData = await Requests.findAll();
  io.to(
    userSockets[
      parseInt(
        requestData.filter(
          (item) => item.orderId.toString() === req.body.orderId.toString()
        )[0].requestedFrom
      )
    ]
  ).emit("progressUpdate", orderData);
  io.to(
    userSockets[
      services.filter(
        (item) =>
          item.id ===
          parseInt(
            requestData.filter(
              (item) => item.orderId.toString() === req.body.orderId.toString()
            )[0].orderId
          )
      )[0].userId
    ]
  ).emit("progressUpdateUser", orderData);
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
app.post("/payment", async (req, res) => {
  text_ref = req.body.refText;
  var options = {
    method: "POST",
    url: "https://api.chapa.co/v1/transaction/initialize",
    headers: {
      Authorization: "Bearer CHASECK_TEST-IjiumdwjjtyyHauZeofjFkm2248FIVG4",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: req.body.amount,
      currency: "ETB",
      email: req.body.email,
      first_name: req.body.firstName,
      last_name: req.body.middleName,
      phone_number: req.body.phoneNumber,
      tx_ref: req.body.refText,
      callback_url: "https://webhook.site/b6f1d7b2-e3e5-4e47-8da0-7727c6ae4980",
      return_url: "https://iwork.onrender.com/pay",
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments",
    }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body.data.checkout_url);
  });
});
app.get("/pay", function (req, res) {
  var options = {
    method: "GET",
    url: "https://api.chapa.co/v1/transaction/verify/" + text_ref,
    headers: {
      Authorization: "Bearer CHASECK_TEST-Nt7a5Xqx232BeJrx3od1eP3nwxuqTAr9",
    },
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    const responseBody = JSON.parse(response.body);
    res.send(responseBody);
    console.log("payment successful");
  });
});
db.sequelize.sync().then(() => {
  http.listen("3001", () => {
    console.log("Server is running on port 3001");
  });
});
