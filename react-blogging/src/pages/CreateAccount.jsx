import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import src from "../assets/BS-logo.png";
import axios from "axios";

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function submissionHanndler(event) {
    try {
      event.preventDefault();
      if (password === confirmPassword) {
        const response = await axios.post("/api/user", {
          username,
          name,
          email,
        });
        await createUserWithEmailAndPassword(getAuth(), email, password);
        navigate("/");
      } else {
        setError("Password and Confirm Password are not same");
      }
    } catch (e) {
      console.log("there is an error");
      console.log(e);
    }
  }
  return (
    <div className="flex min-h-full w-full font-serif">
      <div className="flex flex-col h-screen w-full justify-center">
        <img
          src={src}
          alt="My logo"
          className="w-80 mx-auto text-center h-[20%]"
        />
        <h2 className="text-center text-2xl lg:text-3xl font-semibold p-7 pt-0 mx-auto">
          Sign Up
        </h2>
        <form
          action=""
          className="flex flex-col w-[90%] lg:w-[30%] justify-center align-middle mx-auto lg:text-lg text-sm"
          onSubmit={submissionHanndler}
        >
          <label htmlFor="name" className="py-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="h-9 px-3 border-gray-300 border-2 rounded-md text-black"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label htmlFor="username" className="py-2">
            Create Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="h-9 px-3 border-gray-300 border-2 rounded-md text-black"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label htmlFor="email" className="py-2">
            Email Address
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="h-9 px-3 border-gray-300 border-2 rounded-md text-black"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <label htmlFor="password" className="py-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="h-9 px-3 border-gray-300 border-2 rounded-md text-black"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label htmlFor="confirmPassword" className="py-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="h-9 px-3 border-gray-300 border-2 rounded-md text-black"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="rounded-md w-32 mt-5 self-center bg-orange-500 py-2 text-white active:translate-y-1 shadow-lg shadow-slate-900"
          >
            Create Account
          </button>
        </form>
        <Link to="/login" className="text-center mt-2 ">
          <span className="w-auto text-blue-500 underline active:text-blue-800">
            Already have a account? Login
          </span>
        </Link>
      </div>
    </div>
  );
}
