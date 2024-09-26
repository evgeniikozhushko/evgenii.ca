import { documentToReactComponents } from "@contentful/rich-text-react-renderer"; // Import rich text renderer
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types"; // Import rich text types
import { getAllPosts } from "@/contentful/core";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Image } from "@nextui-org/react";

export default function IndexPage() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const fallbackImage =
    "//images.ctfassets.net/vrssbejn74f5/1TddS8rtGvdvzXmvIzSnZU/4c436f876730492e22d6923d2d803ead/2023_BVCAS_blog.jpg";

  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [displayImage, setDisplayImage] = useState<string>(fallbackImage);

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
            <ul className="list-disc pl-5">{children}</ul>
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

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div className="flex flex-col items-start p-8">
        <h1 className="text-4xl md:text-4xl lg:text-4xl font-extrabold leading-tight hover:skew-x-6 hover:scale-110 transition-transform duration-700 ease-in-out">
          evgenii.ca
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl font-extralight mt-4 hover:skew-x-3 hover:scale-105 transition-transform duration-700 ease-in-out">
          design + web development
        </p>
      </div>

      {/* Accordion and Image Section */}
      <div className="flex items-start p-8 space-x-8">
        <div className="w-1/2">
          <Accordion>
            {blogPosts.map((post: any) => {
              const imageUrl =
                post.fields.coverImage?.fields?.file?.url || fallbackImage;
              const title = post.fields.title;
              const postContent = post.fields.content;

              return (
                <AccordionItem
                  key={post.sys.id}
                  aria-label={title}
                  title={title}
                  onClick={() => setDisplayImage(imageUrl)}
                >
                  {postContent
                    ? renderPostContent(postContent)
                    : defaultContent}
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
        <div className="flex w-1/2 justify-end">
          <Image
            isZoomed
            width={"100%"}
            alt="Project Image"
            src={displayImage} // Display the selected image
          />
        </div>
      </div>
    </DefaultLayout>
  );
}

{
  /* Large Format Image */
}
{
  /* <div className="mt-8 w-full">
            <Link to="/intro">
              <img 
                src={blogPosts[0].fields.coverImage?.fields?.file?.url}
                alt="Hero Image" 
                className="w-full h-auto rounded-xl hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </Link>
          </div> */
}

{
  /* Card Section */
}
{
  /* <div className="flex flex-wrap w-full h-auto rounded-xl my-8">
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
      </div> */
}
