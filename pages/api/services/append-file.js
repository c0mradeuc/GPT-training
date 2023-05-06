import fs from "fs";

export default async function (filename, filepath, data) {
  // Comprobamos si el archivo existe
  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      // Si el archivo no existe, lo creamos
      fs.writeFile(filepath, data, (err) => {
        if (err) throw err;
        console.log(`El archivo ${filename} ha sido creado con éxito.`);
      });
    } else {
      // Si el archivo existe, hacemos append de la data en el archivo
      fs.appendFile(filepath, data, (err) => {
        if (err) throw err;
        console.log(`Los datos han sido añadidos al archivo ${filename} con éxito.`);
      });
    }
  });
}