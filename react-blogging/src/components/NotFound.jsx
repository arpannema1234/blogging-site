import imgsrc from "../assets/website-error.jpg";
import Navbar from "./Navbar";
export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="w-full h-[85vh] flex flex-col justify-center align-middle ">
        <div className="w-[20%] mx-auto ">
          <img
            src={imgsrc}
            alt="404 Not Found"
            className="aspect-square w-full h-full"
          />
        </div>
        <h1 className="mx-auto mt-10 text-2xl font-semibold">
          This Page Does not Exist Please got a valid route
        </h1>
      </div>
    </>
  );
}
