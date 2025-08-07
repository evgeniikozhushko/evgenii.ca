import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";

export default function About() {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 pt-12 sm:pt-8 md:pt-4 w-full">
        {/* <Card isFooterBlurred className="border-none w-full" radius="lg">
          <Image
            alt="Woman listing to music"
            className="object-cover"
            height={200}
            src="#"
            width={100}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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
        </CardFooter>
        </Card> */}
        <h4 className="text-base sm:text-lg md:text-xl font-extralight leading-relaxed text-foreground hover:skew-x-1 hover:scale-[1.02] transition-all duration-500 ease-in-out max-w-[900px] px-0 sm:px-4 mx-auto pt-4 md:py-12">
          I’m Evgenii Kozhushko — a visual designer turned full-stack developer.
          I bring a design-first mindset to every project, merging creative
          direction with technical execution.
          <br />
          <br />
          With a background in branding and
          storytelling, I build digital experiences that are not only modern and
          scalable but also intuitive and visually engaging. Using tools like
          MongoDB, Express.js, React, Node.js, and Next.js, I develop concepts into
          accessible, user-focused web applications.
        </h4>
      </section>
    </>
  );
}

// className={title()}
