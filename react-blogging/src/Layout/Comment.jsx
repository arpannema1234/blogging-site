import ProfileIcon from "../UI/ProfileIcon";

export default function Comment({ user, comment, id }) {
  return (
    <>
      <li className="mt-4 flex h-auto" key={id}>
        <div className="mt-2 mr-1 md:w-[24px] w-[18px] h-auto">
          <ProfileIcon />
        </div>
        <div className="text-base md:text-lg max-w-[90%] flex-1 ml-2">
          <div>{user}</div>
          <div className="break-words">{comment}</div>
        </div>
      </li>
    </>
  );
}
