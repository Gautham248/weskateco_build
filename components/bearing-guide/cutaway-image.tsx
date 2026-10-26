import Image from "next/image";
import wheelCutawayImg from "components/icons/bearing_guide/wheel-cutaway.webp";
import { FigCaption } from "components/guides/ui";
import { renderRich } from "components/guides/rich";

export function CutawayImage({
  caption,
  alt,
}: {
  caption: string;
  alt: string;
}) {
  return (
    <figure className="w-full flex flex-col">
      <div className="w-full bg-white border border-neutral-200 rounded-[16px] p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <Image
          src={wheelCutawayImg}
          alt={alt}
          width={920}
          height={674}
          sizes="(min-width: 1024px) 800px, 92vw"
          className="h-auto w-full max-w-[800px] object-contain rounded-[8px]"
        />
      </div>
      {caption && <FigCaption>{renderRich(caption)}</FigCaption>}
    </figure>
  );
}
