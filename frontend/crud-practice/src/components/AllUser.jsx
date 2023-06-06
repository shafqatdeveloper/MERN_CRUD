import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { allUser, deleteuser } from "../ApiCalls.jsx";
import { Link, useNavigate } from "react-router-dom";

const AllUser = () => {
  
  useEffect(() => {
    getAllUsers();
  }, []);

  const [getUsers, setGetUsers] = useState([]);

  const getAllUsers = async () => {
    let resp = await allUser();
    setGetUsers(resp.data);
  };

  const deleteUser = async (id) => {
    await deleteuser(id);
    getAllUsers();
  };

  return (
    <div>
      <h1>ALL USERS</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getUsers.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>
                  <div className="flex justify-center mt-1.5 items-center gap-5">
                    <Link to={`/edituser/${item._id}`} >
                    <button
                     className="text-white py-1.5 bg-sky-500 rounded-md px-3">
                      EDIT
                    </button>
                    </Link>
                    <button
                      onClick={() => deleteUser(item._id)}
                      className="text-white py-1.5 bg-red-500 rounded-md px-1"
                    >
                      DELETE
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllUser;
