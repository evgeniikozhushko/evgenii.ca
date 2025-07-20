import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function About() {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
        <Card isFooterBlurred className="border-none w-full" radius="lg">
          <Image
            alt="Woman listing to music"
            className="object-cover"
            height={200}
            src="#"
            width={100}
          />
          {/* <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-white/80">Available soon.</p>
          <Button
            className="text-tiny text-white bg-black/20"
            color="default"
            radius="lg"
            size="sm"
            variant="flat"
          >
            Notify me
          </Button>
        </CardFooter> */}
        </Card>
      </section>
    </>
  );
}

// className={title()}
