import CommentForm from "../Layout/CommentForm";
import CommentList from "./CommentList";
import Feedback from "../Layout/Feedback";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import HomeContext from "../store/home-context";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BlogComponent() {
  const [showComment, setShowComment] = useState(false);
  const [blog, setBlog] = useState(undefined);
  const ctx = useContext(HomeContext);
  const { blogid } = useParams();
  useEffect(() => {
    setBlog(undefined);
    let tempBlog = ctx.blogs.find((x) => x._id === blogid);
    if (!tempBlog) {
      ctx.setBlogId(blogid);
    } else {
      setBlog(tempBlog);
    }
  }, [blogid, ctx.blogs]);

  function toggleComment() {
    setShowComment((prev) => !prev);
  }

  return (
    <div className="w-[80%] md:w-[70%] lg:w-[50%] mx-auto">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <h1 className="text-2xl md:text-3xl mb-6 mt-6 font-semibold">
          {(blog && blog.title) || <Skeleton />}
        </h1>
        <div className="w-[70%] lg:w-[50%] mx-auto my-10">
          {(blog && (
            <img
              src={blog.images}
              alt="Thumbnail"
              className="object-cover w-full h-full aspect-square"
            />
          )) || <Skeleton className="w-full h-full aspect-square" />}
        </div>
        {(blog && (
          <p
            className="text-base md:text-lg text-justify"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        )) || <Skeleton count={6} />}
        {blog && (
          <Feedback
            upvotes={blog.upvotes}
            downvotes={blog.downvotes}
            tComment={toggleComment}
            canUpvote={blog.canUpvote}
            canDownvote={blog.canDownvote}
          />
        )}
        {showComment && <CommentForm />}
        {(blog && showComment && <CommentList comments={blog.comments} />) ||
          (!blog && (
            <div className="mt-5 my-10">
              <Skeleton count={3} />
            </div>
          ))}
      </SkeletonTheme>
    </div>
  );
}
