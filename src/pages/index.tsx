import { documentToReactComponents } from "@contentful/rich-text-react-renderer"; // Import rich text renderer
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types"; // Import rich text types
import { getAllPosts, getOrderedPosts } from "@/contentful/core";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  Card,
  CardHeader,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Selection } from "@react-types/shared"; // Import the Selection type

export default function IndexPage() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const fallbackImage =
    "//images.ctfassets.net/vrssbejn74f5/1TddS8rtGvdvzXmvIzSnZU/4c436f876730492e22d6923d2d803ead/2023_BVCAS_blog.jpg";

  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [displayImage, setDisplayImage] = useState<string | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [displayVideo, setDisplayVideo] = useState<string | null>(null);

  useEffect(() => {
    const getBlogData = async () => {
      try {
        console.log("Attempting to fetch posts ordered by position field...");

        // Approach 1: Try using the enhanced getOrderedPosts function
        let blogData = await getOrderedPosts("fields.position", "desc");

        // If that didn't work, try Approach 2: Direct ordering with getAllPosts
        if (!blogData || !blogData.items || blogData.items.length === 0) {
          console.log(
            "First attempt failed. Trying direct ordering parameter..."
          );
          blogData = await getAllPosts({
            order: "-fields.position", // Descending order (minus sign)
          });
        }

        // If that still didn't work, try Approach 3: Try with capitalized field name
        if (!blogData || !blogData.items || blogData.items.length === 0) {
          console.log(
            "Second attempt failed. Trying with capitalized field name..."
          );
          blogData = await getAllPosts({
            order: "-fields.Position", // Try capitalized
          });
        }

        console.log("Blog Data Response:", blogData); // Log response

        if (!blogData || !blogData.items || blogData.items.length === 0) {
          console.warn(
            "All ordering attempts failed. Falling back to default ordering..."
          );
          // Fall back to default ordering
          const fallbackData = await getAllPosts();

          if (fallbackData && fallbackData.items) {
            const filteredPosts = fallbackData.items.filter(
              (post: any) => post.fields.title !== "Intro"
            );
            console.log(
              "Using fallback ordering with filtered posts:",
              filteredPosts
            );
            setBlogPosts(filteredPosts);
          } else {
            console.error("Failed to fetch posts with any method.");
            setBlogPosts([]);
          }
        } else {
          // Process the successfully retrieved posts
          let filteredPosts = blogData.items.filter(
            (post: any) => post.fields.title !== "Intro"
          );

          // Perform client-side sorting as an additional fallback
          // This ensures order even if Contentful API doesn't respect the order parameter
          try {
            if (
              filteredPosts.length > 0 &&
              filteredPosts[0].fields.position !== undefined
            ) {
              console.log(
                "Performing additional client-side sorting by position field"
              );

              filteredPosts.sort((a, b) => {
                const posA = Number(a.fields.position) || 0;
                const posB = Number(b.fields.position) || 0;
                return posB - posA; // Descending order (higher numbers first)
              });
            }
          } catch (sortError) {
            console.warn("Could not perform client-side sorting:", sortError);
          }

          console.log("Final filtered and sorted posts:", filteredPosts);
          setBlogPosts(filteredPosts);
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setBlogPosts([]);
      }
    };

    getBlogData(); // Call the async function
  }, []);

  // Function to render rich text content from Contentful
  const renderPostContent = (content: any) => {
    console.log("logging content", content);
    if (content && content.nodeType === "document") {
      // Ensure it's valid rich text
      const contentfulOptions = {
        renderMark: {
          [MARKS.CODE]: (embedded: any) => (
            <span className="code-block-wrapper">
              <span className="relative-parent">
                <span dangerouslySetInnerHTML={{ __html: embedded }} />
              </span>
            </span>
          ),
        },
        renderNode: {
          "embedded-asset-block": (node: any) => (
            <img
              className="max-w-full h-auto my-5" // Adjusted for responsiveness
              src={node.data.target.fields.file.url}
              alt={node.data.target.fields.title || "Image"}
            />
          ),
          [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
            <p className="whitespace-pre-wrap">{children}</p>
          ),
          [BLOCKS.UL_LIST]: (_node: any, children: any) => (
            <ul className="list-upper-roman pl-5">{children}</ul>
          ),
          [BLOCKS.OL_LIST]: (_node: any, children: any) => (
            <ol className="list-decimal pl-5">{children}</ol>
          ),
          [BLOCKS.LIST_ITEM]: (_node: any, children: any) => (
            <li className="mb-2">{children}</li>
          ),
          [BLOCKS.QUOTE]: (_node: any, children: any) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 text-gray-600 italic">
              {children}
            </blockquote>
          ),
          [INLINES.HYPERLINK]: (node: any, children: any) => (
            <a
              href={node.data.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 hover:no-underline"
            >
              {children}
            </a>
          ),
        },
        renderText: (text: any) => (
          <span style={{ whiteSpace: "pre-wrap" }}>
            {text
              .split("\n")
              .reduce((children: any, textSegment: any, index: any) => {
                return [
                  ...children,
                  index > 0 && <br key={index} />,
                  textSegment,
                ];
              }, [])}
          </span>
        ),
      };
      return documentToReactComponents(content, contentfulOptions); // Apply rich text rendering
    }
    return <p>{defaultContent}</p>; // Fallback for no content
  };

  // Loading and error states
  if (!blogPosts.length) {
    return (
      <DefaultLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">
            Status: Loading or No Posts Available
          </h1>
          <p className="mb-4">
            This could be due to one of the following reasons:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Content is still loading from Contentful</li>
            <li>No posts were found in your Contentful space</li>
            <li>
              The field name 'position' might not match what's in your
              Contentful model
            </li>
            <li>
              There was an error connecting to Contentful (check console for
              details)
            </li>
          </ul>
          <p>
            Please check your browser's console for more detailed error
            messages.
          </p>
        </div>
      </DefaultLayout>
    );
  }

  const handleSelectionChange = (keys: Selection) => {
    // Convert keys to an array
    const selectedKeys = Array.from(keys);

    if (selectedKeys.length > 0) {
      const newOpenKey = selectedKeys[0]; // Assume the first selected key
      setOpenKey(newOpenKey.toString());
      const openPost = blogPosts.find((post) => post.sys.id === newOpenKey);
      if (openPost) {
        const imageUrl =
          openPost.fields.coverImage?.fields?.file?.url || fallbackImage;
        setDisplayImage(imageUrl);
        const videoUrl = openPost.fields.videoFile?.fields?.file?.url || null; // Fetch the video file URL if available
        setDisplayVideo(videoUrl);
      }
    } else {
      // Handle the case where no keys are selected
      setOpenKey(null);
      setDisplayImage(null);
      setDisplayVideo(null);
    }
  };

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div className="flex flex-col items-start p-6 pb-16 md:p-6 md:pt-8 md:pb-20 lg:p-6 lg:pt-8 lg:pb-20">
        {" "}
        {/* md:p-8 /*/}
        <h1 className="text-3xl md:text-3xl lg:text-3xl font-extrabold leading-tight hover:skew-x-6 hover:scale-110 transition-transform duration-700 ease-in-out">
          evgenii.ca
        </h1>
        <p className="text-md md:text-lg lg:text-lg font-extralight mt-2 hover:skew-x-3 hover:scale-105 transition-transform duration-700 ease-in-out">
          design + web development
        </p>
      </div>

      {/* HeroUI Card-CoverImage */}
      <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">

        {/* HeroUI Card-CoverImage 1*/}
        <Card className="col-span-12 sm:col-span-4 h-[300px]">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Hello
            </p>
            <h4 className="text-white font-medium text-large">
              Stream the Acme event
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src="https://heroui.com/images/card-example-4.jpeg"
          />
        </Card>

        {/* HeroUI Card-CoverImage 2 */}
        <Card className="col-span-12 sm:col-span-4 h-[300px]">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Plant a tree
            </p>
            <h4 className="text-white font-medium text-large">
              Contribute to the planet
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src="https://heroui.com/images/card-example-3.jpeg"
          />
        </Card>
        <Card className="col-span-12 sm:col-span-4 h-[300px]">
          <CardHeader className="absolute z-10 top-1 flex-col !items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Supercharged
            </p>
            <h4 className="text-white font-medium text-large">
              Creates beauty like a beast
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card background"
            className="z-0 w-full h-full object-cover"
            src="https://heroui.com/images/card-example-2.jpeg"
          />
        </Card>
        <Card
          isFooterBlurred
          className="w-full h-[300px] col-span-12 sm:col-span-5"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">New</p>
            <h4 className="text-black font-medium text-2xl">Acme camera</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src="https://heroui.com/images/card-example-6.jpeg"
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black text-tiny">Available soon.</p>
              <p className="text-black text-tiny">Get notified.</p>
            </div>
            <Button
              className="text-tiny"
              color="primary"
              radius="full"
              size="sm"
            >
              Notify Me
            </Button>
          </CardFooter>
        </Card>
        <Card
          isFooterBlurred
          className="w-full h-[300px] col-span-12 sm:col-span-7"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">
              Your day your way
            </p>
            <h4 className="text-white/90 font-medium text-xl">
              Your checklist for better sleep
            </h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src="https://heroui.com/images/card-example-5.jpeg"
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center">
              <Image
                alt="Breathing app icon"
                className="rounded-full w-10 h-11 bg-black"
                src="https://heroui.com/images/breathing-app-icon.jpeg"
              />
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">Breathing App</p>
                <p className="text-tiny text-white/60">
                  Get a good night&#39;s sleep.
                </p>
              </div>
            </div>
            <Button radius="full" size="sm">
              Get App
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Accordion and Image Section */}
      <div className="flex flex-col md:flex-row items-start p-4 md:p-4 lg:px-4 md:space-x-8">
        {/* Accordion */}
        <div className="w-full md:w-1/2">
          <Accordion
            onSelectionChange={handleSelectionChange}
            selectionMode="single"
          >
            {blogPosts.map((post: any) => {
              const title = post.fields.title;
              const postContent = post.fields.content;
              const key = post.sys.id;

              return (
                <AccordionItem
                  key={key}
                  aria-label={title}
                  title={title}
                  // Removed onClick handler
                >
                  {postContent
                    ? renderPostContent(postContent)
                    : defaultContent}
                  {/* Image inside AccordionItem, shown on mobile */}
                  {openKey === key && displayImage && (
                    <div className="block md:hidden my-6">
                      <Image
                        isZoomed
                        width={"100%"}
                        alt="Project Image"
                        src={displayImage}
                      />
                    </div>
                  )}
                  {/* Video inside AccordionItem, shown on mobile */}
                  {openKey === key && displayVideo && (
                    <div className="block md:hidden mt-4">
                      <video controls width="100%">
                        <source src={displayVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        {/* Image Section outside Accordion, shown on desktop */}
        <div
          className={`w-full md:w-1/2 m-4 md:mt-0 flex justify-center hidden md:block`}
        >
          {displayImage && (
            <Image
              isZoomed
              width={"100%"}
              alt="Project Image"
              src={displayImage}
            />
          )}
          {/* Video outside Accordion, shown on desktop */}
          {displayVideo && (
            <video controls width="100%" className="mt-4">
              <source src={displayVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

/* Large Format Image */
/* 
<div className="mt-8 w-full">
  <Link to="/intro">
    <img 
      src={blogPosts[0].fields.coverImage?.fields?.file?.url}
      alt="Hero Image" 
      className="w-full h-auto rounded-xl hover:scale-105 transition-transform duration-700 ease-in-out"
    />
  </Link>
</div> 
*/

/* Card Section */
/* 
<div className="flex flex-wrap w-full h-auto rounded-xl my-8">
  {blogPosts.map((post: any) => {
    const imageUrl = post.fields.coverImage?.fields?.file?.url;
    const title = post.fields.title;

    return (
      <Card
        key={post.sys.id}
        title={title}
        imageUrl={imageUrl} // Pass the image URL
        fixedImageUrl={post.fields.fixedImageUrl} // Provide a valid value for fixedImageUrl
      />
    );
  })}
</div> 
*/
