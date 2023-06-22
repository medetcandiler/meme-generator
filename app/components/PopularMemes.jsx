import React from "react";
import Image from "next/image";

const PopularMemes = ({ memes }) => {
  console.log(memes, '000')
  return (
    <div className="overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
      <div className="flex">
        {memes.map((meme, index) => (
          <div key={meme.id} className="mr-4">
            <Image
              src={meme.url}
              width={50}
              height={50}
              alt={meme.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMemes;
