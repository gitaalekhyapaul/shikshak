import { promises as fs } from "fs";
import { join } from "path";
import dataURIToBuffer from "data-uri-to-buffer";
import buffertoDataURI from "datauri";

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
