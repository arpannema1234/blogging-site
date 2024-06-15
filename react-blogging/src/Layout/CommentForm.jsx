import { getAuth } from "firebase/auth";
import ProfileIcon from "../UI/ProfileIcon";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HomeContext from "../store/home-context";
import useUser from "../hooks/useUser";
import { toast } from "react-toastify";

export default function CommentForm() {
  const [comment, setComment] = useState("");
  const { blogid } = useParams();
  const ctx = useContext(HomeContext);
  const { user } = useUser();
  async function handleSubmit(e) {
    e.preventDefault();
    if (user) {
      const token = await user.getIdToken();
      const headers = token ? { authtoken: token } : {};
      const response = await axios.post(
        `/api/blog/${blogid}/comment`,
        {
          comment,
        },
        { headers }
      );
      ctx.setBlogs((prev) => {
        const newBlogs = prev.splice();
        return newBlogs.map((blog) => {
          if (response.data._id === blogid) {
            return response.data;
          } else {
            return blog;
          }
        });
      });
      console.log(ctx.blogs);
      setComment("");
    } else {
      toast.info("Please Login to post a Comment");
    }
  }
  return (
    <div className="mx-auto w-[100%] md:w-[90%] flex align-middle bg-[#524C42] md:p-4 p-2 mt-4 rounded-2xl">
      <div className="md:h-11 md:w-11 md:mr-6 w-7 h-7 m-0 my-auto">
        <ProfileIcon />
      </div>
      <form className="my-auto flex-1 flex" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write Comment"
          className=" w-[70%] md:w-[80%] bg-[#E2DFD0] text-sm md:rounded-full md:py-3 md:px-5 px-2 md:text-base outline-none text-black rounded-2xl md:h-auto h-10 my-auto ml-2 lg:ml-1"
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <button
          type="submit"
          className="flex-1 bg-blue-800 rounded-full p-2 transition-all ease-in text-xs md:text-sm lg:text-base ml-3 hover:bg-blue-900 active:bg-blue-950 shadow-sm shadow-black active:translate-y-[1px]"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
}
