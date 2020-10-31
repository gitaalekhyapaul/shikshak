import { Server } from "http";
import socketIO from "socket.io";
import { errors } from "../error/error.constant";

export class SocketService {
  private static instance: SocketService;
  private io: null | socketIO.Server = null;
  private constructor() {}

  public initalize = async (expressServer: Server): Promise<void> => {
    try {
      this.io = socketIO(expressServer);
      console.info(`Connected to Socket.IO on Port ${process.env.PORT}`);
    } catch (err) {
      console.error("Could not connect to Socket.IO Server");
      console.error("SocketIOError\n%o", { error: err });
      throw errors.SOCKETIO_CONNECT_ERROR;
    }
  };

  public static getInstance = (): SocketService => {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
      return SocketService.instance!;
    }
    return SocketService.instance!;
  };
  public getIO = (): socketIO.Server => {
    return this.io!;
  };
}
