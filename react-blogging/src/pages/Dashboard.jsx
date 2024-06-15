import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useUser from "../hooks/useUser";
import { toast } from "react-toastify";
const tableList = ["S.No", "Thumbnail", "Title", "Date", "Action"];
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
export default function Dashboard() {
  const [userData, setUserData] = useState({});
  const [userBlogs, setUserBlogs] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userBlogs);
    async function getUserData() {
      if (user) {
        try {
          const token = await user.getIdToken();
          const headers = token ? { authtoken: token } : {};
          const response = await axios.get("/api/user", {
            headers,
          });
          setUserData(response.data.user);
          setUserBlogs(response.data.blogs);
        } catch (error) {
          toast.error("Error in fetching data");
        }
      }
    }
    getUserData();
  }, [user]);
  async function deleteBlog(blogid) {
    const token = await user.getIdToken();
    const headers = token ? { authtoken: token } : {};
    const response = await axios.delete(`/api/blog/${blogid}`, {
      headers,
    });
    if (response.data.message === "Deleted Successfully") {
      setUserBlogs((prev) => prev.filter((blog) => blog._id !== blogid));
      toast.success("Blog Delete Successfully");
    } else {
      toast.error("Cannot Delete Blog");
    }
  }
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="py-10">
        <div className="flex flex-wrap justify-start items-center lg:justify-center gap-2 lg:gap-10 px-4 lg:px-0 mb-8">
          <div className="left">
            <img
              className=" w-40 h-40  object-cover rounded-full border-2 border-pink-600 p-1"
              src={"https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
              alt="profile"
            />
          </div>
          <div className="right">
            <h1 className="font-bold text-2xl mb-2">
              {(userData && userData.name) || <Skeleton />}
            </h1>
            <h2 className="font-semibold mb-2">
              {(userData && userData.email) || <Skeleton />}
            </h2>
            <h2 className="font-semibold">
              <span>Total Blog : {userBlogs.length}</span>
            </h2>
            <div className=" flex gap-2 mt-2">
              <Link
                to="/create-blog"
                className="px-8 py-2 mb-2 bg-slate-700 rounded-3xl hover:bg-slate-900 active:bg-slate-800"
              >
                Create Blog
              </Link>
              <div className="mb-2">
                <button className="px-8 py-2 bg-slate-700 rounded-3xl hover:bg-slate-900 active:bg-slate-800">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Line  */}
        <hr className="border-2" />
        {userBlogs.length === 0 ? (
          <div className="w-full text-center text-2xl font-semibold mt-5">
            <h1>No Blogs Uploded</h1>
          </div>
        ) : (
          <div className="container mx-auto px-4 max-w-7xl my-5">
            <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
              <table className="w-full border-2 border-white shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs ">
                  <tr>
                    {tableList.map((text, index) => (
                      <th scope="col" className="text-lg px-6 py-3" key={index}>
                        {text}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userBlogs.map((blog, index) => (
                    <tr className="border-b-2" key={blog._id}>
                      <td
                        className="px-4 py-4 cursor-pointer"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        {index + 1}
                      </td>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium cursor-pointer"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        <img
                          className="w-16 rounded-lg"
                          src={blog.images}
                          alt="thumbnail"
                        />
                      </th>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        {blog.title}
                      </td>
                      <td
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        {(blog.date && formatDate(blog.date)) ||
                          formatDate(Date.now())}
                      </td>
                      <td>
                        <button
                          className="px-4 py-1 rounded-lg text-white font-bold bg-blue-600 mr-10"
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-1 rounded-lg text-white font-bold bg-red-500"
                          onClick={() => deleteBlog(blog._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SkeletonTheme>
  );
}
