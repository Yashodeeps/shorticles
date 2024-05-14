import React from "react";

interface PostCardtypes {
  authorName: string;
  title: string;
  content: string;
}

const PostCard = ({ authorName, title, content }: PostCardtypes) => {
  return (
    <div className="max-w-xl flex flex-col border-b-2 p-4 m-4 w-full ">
      <div className="text-gray-600 font-semibold text-sm">{authorName}</div>
      <div className="text-2xl font-semibold">{title}</div>
      <div className="text-base text-gray-800  py-3">
        {content.slice(0, 150) + "..."}
      </div>
      <div className="font-semibold">{`${Math.ceil(
        content.length / 300
      )} minutes`}</div>
    </div>
  );
};

export default PostCard;
