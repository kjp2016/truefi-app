import React from "react";
import BotCardContent from "./bot-card-content";
import Image from "next/image";

export default function BotMessageWithImage({
  message,
  images,
}: {
  message: string;
  images: string[] | undefined;
}) {
  return (
    <BotCardContent>
      <p>{message} To know more:</p>
      {images!.length > 0 && images!.map((image, index) => (
        <Image
          key={index}
          src={image}
          width={400}
          height={400}
          layout="responsive"
          alt=""
          className="mt-5 mx-auto"
        />
      ))}
    </BotCardContent>
  );
}
