import { useNavigate } from "react-router-dom";

export default function SearchCard({ id, title, content, setSearch, image }) {
  const navigate = useNavigate();
  function clickHandler() {
    setSearch("");
    navigate(`/blog/${id}`);
  }
  return (
    <div
      className="mb-2 cursor-pointer hover:bg-slate-700 flex"
      onClick={clickHandler}
      key={id}
    >
      <div className="w-[30px] h-[30px] md:w-[60px] md:h-[60px] lg:w-[100px] lg:h-[70px] my-auto">
        <img
          src={image}
          alt="Thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-1 flex-1 my-auto">
        <div className="text-sm md:text-base lg:text-lg font-semibold line-clamp-1 my-auto">
          {title}
        </div>
        <div className="text-sm md:text-base lg:text-lg line-clamp-1">
          {content}
        </div>
      </div>
    </div>
  );
}
