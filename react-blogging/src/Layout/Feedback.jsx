import { toast } from "react-toastify";
import CommentIcon from "../UI/CommentIcon";
import DownvoteIcon from "../UI/DownvoteIcon";
import UpvoteIcon from "../UI/UpvoteIcon";
import useUser from "../hooks/useUser";
import axios from "axios";
import { useParams } from "react-router-dom";
import HomeContext from "../store/home-context";
import { useContext } from "react";

export default function Feedback({
  upvotes,
  downvotes,
  tComment,
  canUpvote,
  canDownvote,
}) {
  const { user } = useUser();
  const { blogid } = useParams();
  const ctx = useContext(HomeContext);
  function toggleComment() {
    tComment();
  }
  let downbg = "";
  let upbg = "";
  if (canDownvote && !canUpvote) {
    upbg = "bg-[#5f5e5c]";
  } else if (!canDownvote && canUpvote) {
    downbg = "bg-[#5f5e5c]";
  }
  async function upvote() {
    if (user) {
      const token = await user.getIdToken();
      const headers = token ? { authtoken: token } : {};
      const response = await axios.put(`/api/blog/${blogid}/upvote`, null, {
        headers,
      });
      ctx.setBlogs((prev) => {
        const newBlogs = [...prev];
        return newBlogs.map((blog) => {
          if (blog._id === blogid) return response.data;
          return blog;
        });
      });
    } else {
      toast.info("Please Login to Upvote");
    }
  }
  async function downvote() {
    if (user) {
      try {
        const token = await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.put(`/api/blog/${blogid}/downvote`, null, {
          headers,
        });
        ctx.setBlogs((prev) => {
          const newBlogs = [...prev];
          return newBlogs.map((blog) => {
            if (blog._id === blogid) return response.data;
            return blog;
          });
        });
        console.log(response.data);
      } catch (err) {
        toast.error(err.message || err.error || "An error Occured");
      }
    } else {
      toast.info("Please Login to Upvote");
    }
  }
  return (
    <div className="my-6 flex align-middle">
      <div className="rounded-full text-black flex align-middle">
        <button
          className={
            "rounded-full hover:bg-[#5f5e5c] active:bg-[#252320] text-black " +
            upbg
          }
          onClick={upvote}
        >
          <UpvoteIcon />
        </button>
        <span className="ml-2 md:text-lg mr-2 text-sm my-auto text-white">
          {upvotes}
        </span>
        <button
          className={
            "rounded-full hover:bg-[#524C42] active:bg-[#302d29] " + downbg
          }
          onClick={downvote}
        >
          <DownvoteIcon />
        </button>
      </div>
      <div
        className="ml-8 rounded-lg px-2 flex align-middle text-white hover:bg-[#524C42] active:bg-[#302d29]"
        onClick={toggleComment}
      >
        <CommentIcon />
      </div>
    </div>
  );
}
