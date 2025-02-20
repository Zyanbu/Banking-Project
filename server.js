import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, () => {
  console.log(`Server is running in port ${port}.`);
});

app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/about", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get("/login", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get("/signup", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post("/signup", (req,res) => {
  console.log(req.body);
});