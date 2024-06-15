import SearchCard from "../Layout/SearchCard";
import Skeleton from "react-loading-skeleton";
export default function SearchModal({ searchList, setSearch, loading }) {
  if (searchList.length === 0 && !loading) {
    return (
      <div className="absolute top-[85%] w-full text-black rounded-b-xl bg-slate-500 shadow-lg z-10 p-2">
        No Result found
      </div>
    );
  } else if (loading) {
    <div className="absolute top-[85%] w-full text-black rounded-b-xl bg-slate-500 shadow-lg z-10">
      <Skeleton />
    </div>;
  }
  return (
    <div className="absolute top-[85%] w-full text-black rounded-b-xl bg-slate-500 shadow-lg z-10">
      {searchList.map((search) => {
        return (
          <SearchCard
            title={search.title}
            content={search.content}
            setSearch={setSearch}
            image={search.images}
            id={search._id}
            key={search._id}
          />
        );
      })}
    </div>
  );
}
