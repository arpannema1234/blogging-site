import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeContext from "../store/home-context";
import useUser from "../hooks/useUser";
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditBlog() {
  const navigate = useNavigate();
  const editor = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const ctx = useContext(HomeContext);
  const { user } = useUser();
  const { blogid } = useParams();

  useEffect(() => {
    let tempBlog = ctx.blogs.find((x) => x._id === blogid);
    if (!tempBlog) {
      ctx.setBlogId(blogid);
    } else {
      setTitle(tempBlog.title);
      setContent(tempBlog.content);
      setImageURL(tempBlog.images);
    }
  }, [blogid, ctx.blogs]);

  function handleSubmit(e) {
    e.preventDefault();
    if (user) {
      saveBlog();
    } else {
      toast.info("Please Login to Post a Blog");
    }
  }

  const saveBlog = async () => {
    const data = new FormData();
    if (image) {
      data.append("file", image);
    }
    data.append("content", content);
    data.append("title", title);

    try {
      if (!image && !imageURL) {
        return toast.error("Please Upload Image");
      }
      const token = await user.getIdToken();
      const headers = {
        authtoken: token,
        "Content-Type": "multipart/form-data",
      };
      const response = await axios.post("/api/blogs", data, { headers });
      console.log(response.data);
      const { _id } = response.data;
      ctx.setBlogs((prev) => [...prev, response.data]);
      navigate(`/blog/${_id}`);
      toast.success("Blog posted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while posting the blog.");
    }
  };

  return (
    <div className="mt-6 rounded-xl mx-auto md:w-[80%] w-[90%] p-4 bg-slate-700 shadow-sm md:text-xl text-base">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="post-title" className="block mb-1">
            Post Title
          </label>
          <input
            type="text"
            id="post-title"
            className="mb-5 w-full rounded-lg p-2 text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block mb-1">
            Upload Thumbnail
          </label>
          {imageURL && (
            <div className="mb-5">
              <img src={imageURL} alt="Current Thumbnail" className="mb-2" />
              <button
                type="button"
                onClick={() => setImageURL("")}
                className="py-1 px-2 bg-red-600 hover:bg-red-800 rounded text-white"
              >
                Remove Image
              </button>
            </div>
          )}
          <input
            type="file"
            id="thumbnail"
            className="text-white mb-5"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setImageURL("");
            }}
          />
        </div>
        <div>
          <label htmlFor="post-content" className="block mb-1">
            Post Content
          </label>
          <JoditEditor
            ref={editor}
            value={content}
            onBlur={(newContent) => setContent(newContent)}
            className="text-black text-base w-full"
          />
        </div>
        <div className="mt-6 md:mt-4">
          <button
            type="button"
            className="py-2 px-3 bg-slate-950 hover:bg-slate-600 active:bg-slate-900 rounded-xl"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 py-2 px-3 bg-slate-950 hover:bg-slate-600 active:bg-slate-900 rounded-xl"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
