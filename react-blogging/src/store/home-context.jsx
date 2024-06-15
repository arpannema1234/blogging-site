import { createContext, useEffect, useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const HomeContext = createContext({
  homeBlogs: [],
  pageNumber: 1,
  hasMore: true,
  setPageNumber: () => {},
  setBlogId: () => {},
  blogs: [],
  setBlogs: () => {},
});

export function HomeContextProvider({ children }) {
  const [homeBlogs, setHomeBlogs] = useState([]);
  const [blogId, setBlogId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const auth = getAuth();
  useEffect(() => {
    let cancel;
    async function getAllBlogs() {
      try {
        const response = await axios({
          method: "GET",
          url: "/api/blogs",
          params: { pageNumber },
          cancelToken: new axios.CancelToken((c) => (cancel = c)),
        });
        setHomeBlogs((prev) => [...prev, ...response.data]);
        if (hasMore && response.data.length === 0) setHasMore(false);
      } catch (err) {
        if (axios.isCancel(err)) return;
        toast.error("An error Occured", {
          autoClose: false,
          closeButton: false,
          closeOnClick: false,
          draggable: false,
        });
      }
    }
    getAllBlogs();
    return () => cancel && cancel();
  }, [pageNumber, hasMore]);

  useEffect(() => {
    const blog = blogs.find((b) => b._id === blogId);
    if (!blog && blogId !== "") {
      async function getBlog() {
        try {
          const fetchBlog = async (headers = {}) => {
            const response = await axios.get(`/api/blog/${blogId}`, {
              headers,
            });
            setBlogs((prev) => [...prev, response.data]);
          };
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              const token = await user.getIdToken();
              fetchBlog({ authtoken: token });
            } else {
              fetchBlog();
            }
          });
        } catch (error) {
          toast.error("Error in fetching the blog", {
            autoClose: false,
            closeButton: false,
            closeOnClick: false,
            draggable: false,
          });
        }
      }
      getBlog();
    }
  }, [blogId, blogs]);

  return (
    <HomeContext.Provider
      value={{
        homeBlogs,
        pageNumber,
        hasMore,
        setPageNumber,
        setBlogId,
        blogs,
        setBlogs,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export default HomeContext;
