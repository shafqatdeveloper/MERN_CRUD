import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { editSingleUser, getuser } from "../ApiCalls.jsx";

const EditUser = () => {
  const defaultValue = {
    name: "",
    email: "",
    username: "",
    phone: "",
  };
  const [user, setUser] = useState(defaultValue);
  const { name, email, username, phone } = user;
  const { id } = useParams();

  useEffect(() => {
    userDetails();
  }, []);

  const userDetails = async () => {
    let respnse = await getuser(id);
    setUser(respnse.data);
  };

  const onvalueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    await editSingleUser(id, user);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <h1>EDIT USER</h1>
      <div className="w-full flex justify-center items-center  h-full">
        <form className="w-[90%] md:w-3/5 flex-col flex gap-5 ">
          <input
            type="text"
            required
            placeholder="Name"
            name="name"
            value={name}
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <input
            type="text"
            required
            placeholder="Email"
            name="email"
            value={email}
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <input
            type="text"
            required
            placeholder="Username"
            name="username"
            value={username}
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <input
            type="text"
            required
            placeholder="Phone"
            name="phone"
            value={phone}
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <button
            onClick={() => updateUser()}
            className="bg-sky-600 w-full py-1.5 text-white font-bold rounded-md"
          >
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
