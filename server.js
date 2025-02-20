import express from "express";
import path, { dirname } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

