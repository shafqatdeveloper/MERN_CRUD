import user from "../models/userSchema.js";

export const addUser = async (req, resp) => {
  const newUser = req.body;
  const validatedUser = new user(newUser);
  try {
    await validatedUser.save();
    resp.status(200).json(validatedUser);
  } catch (e) {
    console.log("Error in Add User Controller");
    resp.status(404).json(e);
  }
};

export const allUsers = async (req, resp) => {
  try {
    const users = await user.find({});
    resp.status(200).json(users);
  } catch (error) {
    resp.status(404).json(error);
  }
};

export const deleteSingleUser = async (req, resp) => {
  try {
    const deleted = await user.deleteOne({ _id: req.params.id });
    resp.status(200).json(deleted);
  } catch (error) {
    resp.status(404).json(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const User = await user.findById(req.params.id);
    console.log("User id is", User);
    res.status(200).json(User);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const editUser = async (req,resp) => {
  const newUser = req.body;
  const validatedUser = new user(newUser);
  try {
    const editedUser = await user.updateOne({_id:req.params.id},validatedUser)
    resp.status(200).json(editedUser)
  } catch (error) {
    resp.status(404).json(error)
  }
}
