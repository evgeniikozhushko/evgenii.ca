import { documentToReactComponents } from "@contentful/rich-text-react-renderer"; // Import rich text renderer
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types"; // Import rich text types
import { getAllPosts } from "@/contentful/core";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
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
      const blogData = await getAllPosts();
      console.log("Full Blog Data Response:", blogData); // Log full response
      if (blogData) {
        console.log("Fetched Blog Data:", blogData.items); // Log full structure
        const filteredPosts = blogData.items.filter(
          (post: any) => post.fields.title !== "Intro"
        );
        setBlogPosts(filteredPosts);
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

  if (!blogPosts.length) return <p>Loading...</p>;

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
                  {postContent ? renderPostContent(postContent) : defaultContent}
                  {/* Image inside AccordionItem, shown on mobile */}
                  {openKey === key && displayImage && (
                    <div className="block md:hidden mt-4">
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
          className={`w-full md:w-1/2 mt-4 md:mt-0 flex justify-center hidden md:block`}
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
