import Image from "next/image";
import { Button } from "./Button";

function GeneratedMeme({ generated, setGenerated }) {
  const handleMakeAnother = () => {
    const confirmation = confirm("Are you sure you want to reset ?");
    if (confirmation) {
      location.reload()
    }
  };

  return (
    <div className="absolute z-10 -translate-y-10 shadow-2xl flex flex-col bg-white pb-10 space-y-5 rounded-sm">
      <div className="p-5">
        <Image
          className="shadow-xl"
          src={generated?.data?.url}
          width={500}
          height={500}
          alt={generated?.data?.url}
        />
      </div>
      <div className="flex flex-col space-y-4 px-10 py-4">
        <div className="flex justify-between">
          <label className="font-semibold" htmlFor="link">
            Image Link:
          </label>
          <input
            className="py-1 w-60 text-sm px-2 border border-slate-600 rounded-sm"
            readOnly
            type="text"
            id="link"
            value={generated?.data?.url}
          />
        </div>
        <div className="flex justify-between">
          <label className="font-semibold" htmlFor="link">
            Image HTML:
          </label>
          <input
            className="py-1  w-60 text-sm  px-2 border border-slate-600 rounded-sm"
            readOnly
            type="text"
            id="link"
            value={`<a href="${generated?.data?.url}"><img src="${generated?.data?.url}" title="made at imgflip.com"/></a><div><a href="https://imgflip.com/memegenerator">from Imgflip Meme Generator</a></div>`}
          />
        </div>
      </div>
      <div className=" text-center">
        <Button onclick={handleMakeAnother}>Make another</Button>
      </div>
    </div>
  );
}

export default GeneratedMeme;
