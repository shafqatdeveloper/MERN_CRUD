import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adduser } from "../ApiCalls.jsx";

const AddUser = () => {
  const naviagate = useNavigate()
  const defaultValue = {
    name: "",
    email: "",
    username: "",
    phone: "",
  };

  const [user, setUser] = useState(defaultValue);

  const onvalueChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitUser = async () => {
    await adduser(user);
     await naviagate('/')
  };

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <h1>ADD USER</h1>
      <div className="w-full flex justify-center items-center  h-full">
        <form className="w-[90%] md:w-3/5 flex-col flex gap-5 ">
          <input
            type="text"
            required
            placeholder="Name"
            name="name"
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <input
            type="text"
            required
            placeholder="Email"
            name="email"
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <input
            type="text"
            required
            placeholder="Username"
            name="username"
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <input
            type="text"
            required
            placeholder="Phone"
            name="phone"
            className="outline-none py-1.5 focus:outline-none border-2 border-black rounded-md w-full"
            onChange={(e) => onvalueChange(e)}
          />
          <button
            onClick={() => submitUser()}
            className="bg-sky-600 w-full py-1.5 text-white font-bold rounded-md"
          >
            ADD
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
