import axios from "axios";
const URL = "http://localhost:5000";

export const adduser = async (data) => {
  try {
    return await axios.post(`${URL}/add`, data);
  } catch (error) {
    console.log("Error in Calling Add User Api", error);
  }
};

export const allUser = async () => {
  try {
    return await axios.get(`${URL}/all`);
  } catch (error) {
    console.log("Error while Calling all Users API", error);
  }
};

export const deleteuser = async (id) => {
  try {
    return await axios.delete(`${URL}/${id}`);
  } catch (error) {}
};

export const getuser = async (id) => {
  try {
    return await axios.get(`${URL}/${id}`);
  } catch (error) {
    console.log("Error while calling single user API", error);
  }
};

export const editSingleUser = async (id, data) => {
  try {
    return await axios.put(`${URL}/${id}`, data);
  } catch (error) {
    console.log(error);
  }
};
