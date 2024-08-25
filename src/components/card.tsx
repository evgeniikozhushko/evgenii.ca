// import { Button } from "@nextui-org/button";
import { Card as NextUICard, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

interface CardProps {
  key: any;
  title: any;
  imageUrl: any;
  fixedImageUrl: any;
  className?: string; // Accept custom class name prop
}


export default function Card({ title, imageUrl, className }: CardProps) {
  // Log the image URL for debugging
  console.log("Image URL:", imageUrl);

  // Fallback image handling
  const placeholderImage = "https://via.placeholder.com/200";
  const imageUrlToUse = imageUrl ? `https:${imageUrl}` : placeholderImage;

  return (
    <NextUICard isFooterBlurred radius="lg" className="flex w-[10] border-none mx-10 mb-10 hover:scale-105 hover:skew-y-1 transition-transform duration-75 ease-in-out">
      <Image
        alt={title}
        className="object-cover w-screen"
        height={400}
        src={imageUrlToUse} // Use fallback or Contentful image
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-white/80">{title}</p>
        {/* <Button
          className="text-tiny text-white bg-black/20"
          variant="flat"
          color="default"
          radius="lg"
          size="sm"
        >
          Check it out
        </Button> */}
      </CardFooter>
    </NextUICard>
  );
}
