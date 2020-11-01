import { Router, Request, Response, NextFunction } from "express";
import { promises as fs } from "fs";

import validateQuery from "../middlewares/validate-query";
import { PostRequestSchema, postRequest } from "./board.schema";
import {
  calibrateBoard,
  generatePixelArray,
  genImageAndStore,
  genImageDataURI,
} from "./board.service";
import { SocketService } from "../services/socket.service";
import { errors } from "../error/error.constant";

const router: Router = Router();

const handlePostCalibrate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardImg, roomId } = req.body as postRequest;
    const fileKey = await genImageAndStore(boardImg, roomId);
    const calibrated = await calibrateBoard(roomId, fileKey);
    if (!calibrated) throw errors.INTERNAL_SERVER_ERROR;
    const responseDataURI = await genImageDataURI(fileKey);
    res.json({
      imgUri: responseDataURI,
    });
    Promise.all([fs.unlink(fileKey)]).catch((err) => {
      console.log(`FileDeleteError for file '${fileKey}'`);
    });
  } catch (err) {
    next(err);
  }
};

const handlePostEmit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { boardImg, roomId } = req.body as postRequest;
    const fileKey = await genImageAndStore(boardImg, roomId);
    const pixelArray = await generatePixelArray(roomId, fileKey);
    if (pixelArray) {
      const io = await SocketService.getInstance().getIO();
      io.to(roomId).emit("update-board", {
        data: pixelArray.data,
        height: pixelArray.height,
        width: pixelArray.width,
      });
      res.json({
        success: true,
      });
    }
    Promise.all([fs.unlink(fileKey)]).catch((err) => {
      console.log(`FileDeleteError for file '${fileKey}'`);
    });
  } catch (err) {
    next(err);
  }
};

router.post(
  "/board/calibrate",
  validateQuery("body", PostRequestSchema),
  handlePostCalibrate
);
router.post(
  "/board/emit",
  validateQuery("body", PostRequestSchema),
  handlePostEmit
);
export default router;
