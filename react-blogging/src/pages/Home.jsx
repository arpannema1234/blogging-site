import { useCallback, useContext, useRef, useEffect, useState } from "react";
import BlogCard from "../Layout/BlogCard";
import HomeContext from "../store/home-context";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function Home() {
  const hctx = useContext(HomeContext);
  const observer = useRef();
  const length = hctx.homeBlogs.length;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading((prev) => !prev);
    if (!hctx.hasMore) {
      setLoading(false);
    }
  }, [length, hctx.hasMore]);

  const lastBlog = useCallback(
    (node) => {
      if (hctx.hasMore) {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            hctx.setPageNumber((prev) => prev + 1);
          }
        });
        if (node) observer.current.observe(node);
      }
    },
    [hctx.hasMore, hctx.setPageNumber]
  );

  return (
    <div className="mt-6">
      {hctx.homeBlogs.map((blog, i) => {
        if (i + 1 === hctx.homeBlogs.length) {
          return (
            <BlogCard
              key={blog._id}
              id={blog._id}
              ref={lastBlog}
              title={blog.title}
              username={blog.username}
              content={blog.content}
              image={blog.images}
            />
          );
        } else {
          return (
            <BlogCard
              key={blog._id}
              id={blog._id}
              title={blog.title}
              username={blog.username}
              content={blog.content}
              image={blog.images}
            />
          );
        }
      })}
      {loading && (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <div className="w-[80%] mx-auto mb-5">
            <Skeleton className="h-36 md:h-40 lg:h-56 w-full mb-4" count={2} />
          </div>
        </SkeletonTheme>
      )}
    </div>
  );
}
