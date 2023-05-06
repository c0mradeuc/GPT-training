import fs from "fs";

export default async function deleteFiles(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(`${folderPath}/${file}`, (err) => {
        if (err) throw err;
      });
    }
  });
}
