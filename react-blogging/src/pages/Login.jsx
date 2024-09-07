import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import src from "../assets/BS-logo.png";
import { ToastContainer, toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test@123");
  const navigate = useNavigate();
  async function submissionHanndler(event) {
    try {
      event.preventDefault();
      const id = toast.loading("Logging...");
      await signInWithEmailAndPassword(getAuth(), email, password);
      toast.update(id, {
        render: "Logged In Successfully",
        type: "success",
        isLoading: false,
        autoClose: true,
      });
      navigate("/");
    } catch (e) {
      toast.error("Invalid Email or Password");
    }
  }
  return (
    <div className="flex min-h-full w-full">
      <div className="flex flex-col h-screen w-full justify-center pb-40">
        <img
          src={src}
          alt="My logo"
          className="w-80 mx-auto text-center pt-5 h-[30%]"
        />
        <h2 className="text-center text-2xl lg:text-3xl font-semibold p-7 pt-0 mx-auto">
          Sign In your account
        </h2>
        <form
          action=""
          className="flex flex-col w-[90%] lg:w-[30%] justify-center align-middle mx-auto lg:text-lg text-sm"
          onSubmit={submissionHanndler}
        >
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
            value={email}
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
            value={password}
          />
          <button
            type="submit"
            className="rounded-md w-20 mt-5 self-center bg-orange-500 py-2 text-white active:translate-y-1 shadow-lg shadow-slate-900"
          >
            Login
          </button>
        </form>
        <Link to="/create-account" className="text-center mt-2 ">
          <span className="w-auto text-blue-500 underline active:text-blue-800">
            Don't have a account? Create One
          </span>
        </Link>
      </div>
    </div>
  );
}
