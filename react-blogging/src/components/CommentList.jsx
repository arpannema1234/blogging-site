import Comment from "../Layout/Comment";
const DUMMY_COMMNETS = [
  { user: "This is a user", content: "This is a good article" },
  {
    user: "This is another user",
    content:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia, a maxime. Magni magnam asperiores, repudiandae porro necessitatibus tempore. Dignissimos nisi eum libero saepe tempore? In iusto deserunt mollitia minus alias!",
  },
];
export default function CommentList({ comments }) {
  if (comments) {
    return (
      <div className="mb-10">
        <h1 className="w-[90%] text-2xl md:text-3xl font-semibold mt-4 mx-auto">
          Comments
        </h1>
        <ul className="mx-auto w-[90%]">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              user={comment.user}
              comment={comment.comment}
              id={comment._id}
            />
          ))}
        </ul>
      </div>
    );
  } else {
    return <h1>No Comments</h1>;
  }
}
