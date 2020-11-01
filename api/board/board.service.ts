import { promises as fs } from "fs";
import { join } from "path";
import dataURIToBuffer from "data-uri-to-buffer";
import buffertoDataURI from "datauri";
import Axios from "axios";
import { errors } from "../error/error.constant";

export const genImageAndStore = async (
  boardImg: string,
  roomId: string
): Promise<string> => {
  const buffer = dataURIToBuffer(boardImg);
  const fileName = join(__dirname, "..", "..", "store", `${roomId}.jpg`);
  await fs.writeFile(fileName, buffer);
  return fileName;
};

export const genImageDataURI = async (fileKey: string): Promise<string> => {
  const uri = await buffertoDataURI(fileKey);
  return uri!;
};

export const calibrateBoard = async (
  roomId: string,
  fileKey: string
): Promise<boolean> => {
  try {
    const { data } = await Axios.post<{ success: boolean }>(
      `http://127.0.0.1:${process.env.FLASK_PORT}/api/calibrate-board`,
      {
        roomId,
        fileKey,
      }
    );
    return data.success;
  } catch (err) {
    if (!err.response) throw errors.INTERNAL_SERVER_ERROR;
    else return false;
  }
};

export const generatePixelArray = async (
  roomId: string,
  fileKey: string
): Promise<{
  success: boolean;
  height: number;
  width: number;
  data: Array<Array<number>>;
} | null> => {
  try {
    const { data: arrayData } = await Axios.post<{
      success: boolean;
      data: Array<Array<number>>;
      height: number;
      width: number;
    }>(`http://127.0.0.1:${process.env.FLASK_PORT}/api/convert`, {
      roomId,
      fileKey,
    });
    console.log("arrayData", arrayData);
    if (arrayData.success) return arrayData;
    else throw errors.UNAUTHORIZED;
  } catch (err) {
    if (!err.response) throw errors.INTERNAL_SERVER_ERROR;
    else return null;
  }
};
