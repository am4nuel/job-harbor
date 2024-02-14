const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const mainRouter = require("./Router/MainRouter");
const multer = require("multer");
const admin = require("firebase-admin");
const serviceAccount = require("./upload2.json");
const { Works, Requests } = require("./models");
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
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "binipro-ee596.appspot.com", // Replace with your storage bucket
});

const bucket = admin.storage().bucket();
const folderName = "file"; // Replace with the desired folder name

app.use(cors());

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    return cb(null, true);
  } else {
    return cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({ dest: "uploads/", fileFilter: fileFilter });

app.post("/upload", upload.array("files"), async (req, res) => {
  try {
    const storage = admin.storage();
    const uploadedFiles = req.files;

    const uploadPromises = uploadedFiles.map((file) => {
      const filePath = `${folderName}/${file.originalname}`;
      const fileUpload = bucket.file(filePath);

      return new Promise((resolve, reject) => {
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        blobStream.on("error", (error) => {
          console.error("Error uploading file:", error);
          reject(error);
        });

        blobStream.on("finish", async () => {
          const downloadURL = await fileUpload.getSignedUrl({
            action: "read",
            expires: "03-09-2025", // Replace with your desired expiration date
          });

          console.log("File uploaded successfully:", downloadURL);
          // Extracting only the file link without query parameters
          const fileLink = downloadURL[0].split("?")[0];
          resolve(fileLink);
        });

        req.on("data", (chunk) => {
          const progress = (blobStream.bytesWritten / file.size) * 100;
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        });

        blobStream.end(file.buffer);
      });
    });

    const fileLinks = await Promise.all(uploadPromises);

    res.json({
      message: "Files uploaded successfully!",
      fileLinks: fileLinks,
    });
  } catch (error) {
    console.error("Error uploading files:", error); // Log detailed error
    res.status(500).send("Error uploading files");
  }
});
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle custom event "updateRequest" from the client
  socket.on("updateRequest", (data) => {
    console.log("Received updateRequest:", data);

    // Broadcast the updated data to all connected clients
    io.emit("requestUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
// Trigger update event for the connected user when a new request is created
app.post("/setrequests", async (req, res) => {
  const data = await Requests.create(req.body);
  res.send(data);

  // Emit the "requestUpdated" event to the specific user socket
  io.to(userSockets[socket.data.userId]).emit("requestUpdated", data);
});

db.sequelize.sync().then(() => {
  http.listen("3001", () => {
    console.log("Server is running on port 3001");
  });
});
