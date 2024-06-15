import React from "react";
import { useNavigate } from "react-router-dom";
function Card(props, ref) {
  const navigate = useNavigate();
  const { id, title, username, content, image } = props;
  function navigateBlog() {
    navigate(`/blog/${id}`);
  }
  return (
    <div
      key={id}
      className="bg-slate-950 w-[80%] mx-auto mb-5 h-36 md:h-40 lg:h-56 flex cursor-pointer hover:scale-[101%] active:scale-[98%] transition-all ease-in-out transiton duration-200"
      ref={ref}
      onClick={navigateBlog}
    >
      <div className="w-[30%] h-36 md:h-40 lg:h-56 bg-yellow-100">
        <img
          src={image}
          alt="Thumbnail"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1 p-6 overflow-hidden">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-1 mb-3">
          {title}
        </h1>
        <div
          className="text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3 lg:line-clamp-4"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
const BlogCard = React.forwardRef(Card);
export default BlogCard;
