// import { Button } from "@nextui-org/button";
import { Card as NextUICard, CardFooter } from "@nextui-org/card";
import { Image } from "@nextui-org/image";

interface CardProps {
  key: any;
  title: any;
  imageUrl: any;
  fixedImageUrl: any;
}


export default function Card({ title, imageUrl }: CardProps) {
  // Log the image URL for debugging
  console.log("Image URL:", imageUrl);

  // Fallback image handling
  const placeholderImage = "https://via.placeholder.com/200";
  const imageUrlToUse = imageUrl ? `https:${imageUrl}` : placeholderImage;

  return (
    <NextUICard isFooterBlurred radius="lg" className="border-none mx-10 mb-6">
      <Image
        alt={title}
        className="object-cover"
        height={200}
        src={imageUrlToUse} // Use fallback or Contentful image
        width={200}
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
