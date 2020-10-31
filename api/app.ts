import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { config as dotenvConfig } from "dotenv";
import cors from "cors";
import { join } from "path";
import { Server } from "http";

import { errorHandler } from "./error/error.handler";
import { SocketService } from "./services/socket.service";
import { socketController } from "./socket/socket.routes";

dotenvConfig();

const app: Express = express();

app.use(cors());
app.use(bodyParser.json());

app.use(errorHandler);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "..", "client", "build")));
  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendFile(join(__dirname, "..", "client", "build", "index.html"));
    } catch (err) {
      next(err);
    }
  });
}
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
  });
});

const server: Server = app.listen(process.env.PORT, () => {
  console.log(
    `Server:${process.env.NODE_ENV}-mode in Port ${process.env.PORT}`
  );
});

Promise.all([SocketService.getInstance().initalize(server)])
  .then(() => {
    console.log(`Express and Socket.IO successfully set up.`);
    SocketService.getInstance()
      .getIO()
      .on("connection", (socket) => {
        console.log(socket.id, "has connected.");
        socket.emit("your-id", socket.id);
        socket.on("disconnect", () => {
          console.log(socket.id, "has disconnected.");
        });
        socketController(socket);
      });
  })
  .catch((_) => {
    process.exit(1);
  });
