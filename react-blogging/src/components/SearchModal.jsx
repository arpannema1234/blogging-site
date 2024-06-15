import SearchCard from "../Layout/SearchCard";
export default function SearchModal({ searchList, setSearch }) {
  if (searchList.length === 0) {
    return (
      <div className="absolute top-[85%] w-full text-black rounded-b-xl bg-slate-500 shadow-lg z-10 p-2">
        No Result found
      </div>
    );
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
