import clsx from "clsx";
import NextImage from "next/image";
import { useState } from "react";

import type { ImageProps as NextImageProps } from "next/image";

export type ImageProps = NextImageProps & {
  immersive?: boolean;
  isArticleImage?: boolean;
};

export default function Image({
  immersive = true,
  className,
  src,
  alt,
  width,
  height,
  isArticleImage = false,
  style,
}: ImageProps) {
  const [image, setImage] = useState<string>("");

  return (
    <div className={clsx("mdx-image relative mx-auto")}>
      {immersive && image ? (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className={clsx(
            "absolute -inset-8 z-[-1] rounded-[20%] bg-[length:180%_180%] bg-center opacity-25 blur-2xl",
            "hidden",
            "dark:block"
          )}
        />
      ) : null}
      <NextImage
        src={src}
        alt={alt}
        className={clsx(
          "border-divider-light cursor-pointer rounded-lg border",
          "dark:border-divider-dark",
          className
        )}
        width={width}
        height={height}
        onLoad={(img) => {
          const currentSrc = (img.currentTarget as HTMLImageElement)?.src || "";
          setImage(currentSrc);
        }}
        data-article-image={isArticleImage ? "true" : "false"}
        style={style}
      />
    </div>
  );
}
