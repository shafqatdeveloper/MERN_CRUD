import express from "express";
import connection from "./database/db.js";
// import Router from "Routes/routes.js"
import Router from "./Routes/routes.js";
import bodyParser from "body-parser";
const PORT = 5000;
import cors from "cors";

const app = express();
connection();
app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);

app.listen(PORT, () => {
  console.log(`Connection is Running on PORT ${PORT} `);
});
