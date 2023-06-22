"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import qs from "qs";
import { TextField } from "@mui/material";
import debounce from "lodash.debounce";
import { Typography } from "@mui/material";
import { FaRegLightbulb } from 'react-icons/fa'

import { Button } from "./components/Button";
import GeneratedMeme from "./components/GeneratedMeme";

const fetchImages = async () => {
  const res = await axios.get("https://api.imgflip.com/get_memes");
  return res.data;
};

export default function Home() {
  const [memes, setMemes] = useState([]);
  const [pickImg, setPickImg] = useState({
    id: "61579",
    name: "One Does Not Simply",
    url: "https://i.imgflip.com/1bij.jpg",
    width: 568,
    height: 335,
    box_count: 2,
  });
  const [captions, setCaptions] = useState([
    {
      text: "One does not simply",
      x: 10,
      y: 10,
      width: 548,
      height: 100,
      color: "#ffffff",
      outline_color: "#000000",
    },
    {
      text: "Make custom memes on the web via imgflip API",
      x: 10,
      y: 225,
      width: 548,
      height: 100,
      color: "#ffffff",
      outline_color: "#000000",
    },
  ]);
  const [captionErrors, setCaptionErrors] = useState([]);
  const [generated, setGenerated] = useState();
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const initialCaptions = [...Array(pickImg.box_count)].fill("");
    const initialCaptionsWithFeatures = initialCaptions.map(() => ({
      text: "",
      color: "#ffffff",
      outlineColor: "#000000",
    }));
    setCaptions(initialCaptionsWithFeatures);
  }, [pickImg, setPickImg]);

  const queryMemes = useQuery({
    queryKey: ["keys"],
    queryFn: fetchImages,
    onSuccess: (data) => {
      setMemes(data?.data.memes);
    },
  });

  const handlePicker = () => {
    const randomNum = Math.floor(Math.random() * memes.length) + 1;
    const pickedImg = memes[randomNum];
    const initialCaptions = [...Array(pickedImg.box_count)].fill("");
    const initialCaptionsWithFeatures = initialCaptions.map(() => ({
      text: "",
      color: "#ffffff",
      outlineColor: "#000000",
    }));
    setPickImg(pickedImg);
    setCaptions(initialCaptionsWithFeatures);
  };

  const validateCaption = (caption) => {
    if (caption.text.trim() === "") {
      return "Caption is required";
    }
    return "";
  };

  const updateCaption = (e, i) => {
    const newCaptions = captions.map((capt, index) => {
      if (index === i) {
        return {
          ...capt,
          text: e.target.value,
        };
      } else {
        return capt;
      }
    });

    const caption = newCaptions[i];
    const error = validateCaption(caption);
    const newCaptionErrors = [...captionErrors];
    newCaptionErrors[i] = error;
    setCaptionErrors(newCaptionErrors);
    setCaptions(newCaptions);

    const isFormValid = newCaptions.every(
      (caption) => validateCaption(caption) === ""
    );
    setFormValid(isFormValid);

    setCaptions(newCaptions);
  };

  const updateCaptionColor = (index, property, value) => {
    setCaptions((prev) =>
      prev.map((capt, i) => {
        if (i === index) {
          return {
            ...capt,
            [property]: value,
          };
        }
        return capt;
      })
    );
  };

  const debouncedUpdateCaptionColor = debounce(updateCaptionColor, 300);

  const generateMeme = () => {
    const formData = {
      username: "MedetDiler",
      password: "123123asd.",
      template_id: pickImg.id,
      boxes: captions.map((capt) => ({
        text: capt.text,
        color: capt.color,
        outline_color: capt.outline_color,
      })),
    };

    const serializedFormData = qs.stringify(formData);

    fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: serializedFormData,
    })
      .then((res) => res.json())
      .then((data) => setGenerated(data));
  };

  const resetHandler = () => {
    const confirmation = confirm(
      "Are you certain about resetting everything? This action will restore all settings to their default state. Please confirm your intent."
    );
    if (confirmation) {
      location.reload();
    }
  };

  const labelDecider = (index) => `Text #${index + 1}`;

  return (
    <div className="z-0 container mx-auto flex flex-row justify-center bg-white border border-slate-300  rounded-md">
      {generated && (
        <GeneratedMeme setGenerated={setGenerated} generated={generated} />
      )}
      <div id="left" className="flex justify-center">
        {pickImg && (
          <div className=" shadow-xl bg-white h-auto">
            <Image
              src={pickImg.url}
              width={pickImg.width}
              height={pickImg.height}
              alt={pickImg.name}
            />
          </div>
        )}
      </div>
      {/*  */}
      <div
        id="right"
        className="w-full flex flex-col items-center space-y-6 py-10"
      >
        <div className="w-full flex flex-col items-center space-y-6">
          <Typography
            className="text-xl font-semibold text-[#1F2937] shadow-lg "
            variant="h3"
            component="h1"
            align="center"
          >
            Choose a popular meme or pick one at random
          </Typography>

          <section id="popular-memes" className="flex justify-center space-x-1">
            <div className="scroll-container w-max-[300px] h-[80px] md:w-max-[500px] lg:w-[600px]">
              {memes.map((meme) => (
                <Image
                  className="cursor-pointer"
                  onClick={() => setPickImg(meme)}
                  key={meme.id}
                  src={meme.url}
                  width={50}
                  height={50}
                  alt={meme.name}
                />
              ))}
            </div>
          </section>

          <Button onclick={handlePicker}>Pick Random Meme</Button>
          <button  onClick={() => alert('The left color picker is intended for selecting the text color, while the right color picker is for choosing the outline color. In case the background color is white, it is recommended to set the text color to a darker shade for better visibility.')} className=" p-2 rounded-full text-white bg-[#F2BE22]">
            <FaRegLightbulb className="animate-ping"/>
          </button>
        </div>
        {captions.map((caption, index) => (
          <form className="flex  mb-2" key={index}>
            <TextField
              onChange={(e) => updateCaption(e, index)}
              id="outlined-basic"
              label={labelDecider(index)}
              variant="outlined"
              value={caption.text}
              error={captionErrors[index] !== ""}
              helperText={captionErrors[index]}
            />

            <input
              className="h-auto cursor-pointer"
              id="nativeColorPicker1"
              type="color"
              onChange={(e) => {
                const { value } = e.target;
                debouncedUpdateCaptionColor(index, "color", value);
              }}
              value={caption.color}
            />

            <input
              className="h-auto cursor-pointer"
              id="nativeColorPicker1"
              type="color"
              onChange={(e) => {
                const { value } = e.target;
                debouncedUpdateCaptionColor(index, "outline_color", value);
              }}
              value={caption.outline_color}
            />
          </form>
        ))}

        <div id="buttons" className="flex flex-col space-y-3">
          <Button onclick={resetHandler}>Reset</Button>
          <Button onclick={generateMeme} disabled={formValid}>
            Generate Meme
          </Button>
        </div>
      </div>
    </div>
  );
}
