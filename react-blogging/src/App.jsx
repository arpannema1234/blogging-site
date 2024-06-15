import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer position="bottom-right" pauseOnHover={false} draggable />
    </>
  );
}
