import fs from 'node:fs';
import readline from 'readline';

export const readLines = (filePath: string) => {
  const fileStream = fs.createReadStream(filePath);
  return readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
};
