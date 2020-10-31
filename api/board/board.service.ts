import { promises as fs } from "fs";
import { join } from "path";

export const genImageAndStore = async (boardImg: string, roomId: string) => {
  const data = boardImg.split(",")[1];
  const buffer = Buffer.from(data).toString("base64");
  await fs.writeFile(
    join(__dirname, "..", "..", "store", `${roomId}.jpg`),
    buffer
  );
};
