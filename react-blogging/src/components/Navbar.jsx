import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchModal from "./SearchModal";
import useUser from "../hooks/useUser";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import axios from "axios";
import Writeicon from "../UI/WriteIcon";
function Navbar() {
  const { user, isLoading } = useUser();
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    let cancel;
    async function getSearchResult() {
      try {
        const response = await axios({
          method: "GET",
          url: "/api/blog/search",
          params: { q: search },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });

        setSearchList(response.data);
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error(error);
      }
    }
    if (search && search.trim()) {
      getSearchResult();
    }
    return () => cancel && cancel();
  }, [search]);

  function toggleMenu() {
    setMenu((prev) => !prev);
  }
  function handleSubmit(event) {
    event.preventDefault();
  }
  function logoutHandler() {
    try {
      signOut(getAuth());
      if (location.pathname === "/dashboard") {
        navigate("/");
      }
      toast.success("Logged Out Successfully");
    } catch (e) {
      toast.error("Error in Logging Out");
    }
  }
  function handleSearch(event) {
    setSearch(event.target.value);
  }
  let extraClasses = "";
  if (menu) {
    extraClasses = "active:ring-[8px] active:ring-gray-600";
  }

  return (
    <nav className="bg-black text-white flex justify-between align-middle relative">
      <Link
        to="/"
        className="py-6 text-sm sm:text-base md:text-2xl font-semibold ml-4 cursor-pointer"
      >
        Blogging Site
      </Link>
      <div className="w-[25%] xs:w-[40%] sm:w-[50%] flex align-middle relative">
        <form className="w-full self-center" onSubmit={handleSubmit}>
          <input
            type="search"
            value={search}
            onChange={handleSearch}
            className="w-full bg-gray-500 rounded-xl sm:p-2 p-1 text-lg outline-none "
            placeholder="Search Query"
          />
          {search !== "" && (
            <SearchModal searchList={searchList} setSearch={setSearch} />
          )}
        </form>
      </div>

      <div className="md:mr-1 mr-3 my-auto flex justify-center align-middle w-auto">
        <Link
          to="/create-blog"
          className="hover:bg-slate-800 active:bg-slate-700 flex justify-center align-middle h-[70%] my-auto rounded-full mr-4 cursor-pointer p-1 md:p-2 px-3 md:px-6"
        >
          <Writeicon />
          <span className="my-auto md:text-base text-sm">Write</span>
        </Link>
        {user ? (
          <div className="dropdown rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              className={
                "bi bi-person-circle md:h-12 md:w-12 md:mr-6 w-7 h-7 rounded-full hover:ring-[8px] hover:ring-gray-500 " +
                extraClasses
              }
              onClick={toggleMenu}
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
            {menu && (
              <div className="dropdown-content absolute shadow-xl bg-black mt-4 w-32 -translate-x-16 ease-in duration-1000">
                <Link
                  to="/dashboard"
                  className="block hover:bg-slate-600 p-2"
                  onClick={toggleMenu}
                >
                  Account
                </Link>
                <button
                  className="block hover:bg-slate-600 p-2 w-full text-left"
                  onClick={logoutHandler}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-md w-12 md:w-20 py-2 mr-3 bg-orange-500 text-white text-xs md:text-base text-center hover:bg-orange-700 active:translate-y-[1px] shadow-sm shadow-slate-900 font-semibold"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
