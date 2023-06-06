import express from "express";
import { addUser, allUsers, deleteSingleUser, editUser, getUser } from "../controller/userController.js";
const Router = express.Router();

Router.post("/add", addUser);
Router.get("/all", allUsers);
Router.delete("/:id",deleteSingleUser)
Router.get("/:id",getUser)
Router.put("/:id",editUser)

export default Router;
