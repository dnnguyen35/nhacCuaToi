process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import "dotenv/config";
import routes from "./routes/routes.js";
import fileUpload from "express-fileupload";
import path from "path";
import {
  sequelize,
  userModel,
  songModel,
  playlistModel,
  playlistSongModel,
  wishlistModel,
} from "./models/main.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.js";

const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
  })
);

app.get("/ok", (req, res) => {
  res.json({
    message: "Everything still ok",
    timestamp: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
  });
});

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1", routes);

const server = http.createServer(app);

sequelize
  .authenticate()
  .then(() => {
    console.log("DB connected");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("Server listening on port 5000");
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });
