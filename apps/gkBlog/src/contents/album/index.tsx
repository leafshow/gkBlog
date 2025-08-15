import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

import BlurFade from "@/components/ui/BlurFade";

import externalImages from "./ExternalImages";

function BlurFadeDemo() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="photos">
      <div className="columns-2 gap-2 sm:columns-3">
        {externalImages.map((image, idx) => (
          <div
            key={image.url}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            className={clsx(
              "relative mb-0.5 overflow-hidden rounded-lg transition-all duration-300 ease-out",
              hovered !== null && hovered !== idx && "scale-[0.98] blur-sm",
            )}
          >
            <BlurFade delay={0.25 + idx * 0.05} inView>
              <Image
                className="size-full rounded-lg object-contain"
                src={image.url}
                width={800}
                height={600}
                alt={`Album image ${idx + 1}`}
              />
              <div
                className={clsx(
                  "absolute inset-0 flex items-end rounded-lg bg-black/50 py-8 px-4 transition-opacity duration-300",
                  hovered === idx ? "opacity-100" : "opacity-0",
                )}
              >
                <div className="bg-gradient-to-b from-neutral-50 to-neutral-200 bg-clip-text text-xl font-medium text-transparent md:text-2xl">
                  {image.title}
                </div>
              </div>
            </BlurFade>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlbumContents() {
  return (
    <div className={clsx("content-wrapper mdx-contents")}>
      <BlurFadeDemo />
    </div>
  );
}

export default AlbumContents;
