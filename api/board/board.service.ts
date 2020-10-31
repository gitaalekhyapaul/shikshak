import { promises as fs } from "fs";
import { join } from "path";
import dataURIToBuffer from "data-uri-to-buffer";

export const genImageAndStore = async (boardImg: string, roomId: string) => {
  const buffer = dataURIToBuffer(boardImg);
  await fs.writeFile(
    join(__dirname, "..", "..", "store", `${roomId}.jpg`),
    buffer
  );
};
