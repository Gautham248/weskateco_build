import weImg from "components/icons/skatepark/we.png";
import weMobileImg from "components/icons/skatepark/we_mobile.png";
import Image from "next/image";

export default function SkateparkGallerySection() {
  return (
    <section className="w-full bg-white overflow-hidden">
      {/* Desktop Full WE Image */}
      <div className="hidden md:block relative w-full h-auto">
        <Image
          src={weImg}
          alt="We Skateparks gallery desktop"
          width={1536}
          height={810}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Mobile Full WE Image */}
      <div className="block md:hidden relative w-full h-auto">
        <Image
          src={weMobileImg}
          alt="We Skateparks gallery mobile"
          width={600}
          height={900}
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}
