import express from "express";
import connection from "./database/Db.js";
// Make sure the folder name matches exactly ("routes" vs "Routes")
import Router from "./Routes/routes.js";  // <— use the real folder casing
import bodyParser from "body-parser";
import cors from "cors";

const PORT = 5000;

const app = express();

// CORS: allow Vite dev origin
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:8080"] }));

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// DB connection (ensure your MONGO_URI is mongodb://db:27017/mern_crud)
connection();

app.use("/", Router);

// IMPORTANT: bind to 0.0.0.0 for Docker
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connection is Running on PORT ${PORT}`);
});
