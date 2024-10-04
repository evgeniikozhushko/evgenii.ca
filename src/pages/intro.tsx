import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { getAllPosts } from "@/contentful/core";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'; // Import for rendering rich text
import { MARKS, BLOCKS, INLINES } from '@contentful/rich-text-types'; // Import for custom rendering



export default function IntroPage() {
  const [introPost, setIntroPost] = useState<any>(null);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState<string | null>(null); // To handle errors

  useEffect(() => {
    const fetchIntroPost = async () => {
      try {
        const blogData = await getAllPosts();
        if (blogData?.items?.length) {
          // Filter for the post with the title "Intro"
          const intro = blogData.items.find((post: any) => post.fields.title === "Intro");
          if (intro) {
            setIntroPost(intro);
          } else {
            setError("Intro post not found");
            console.error("Intro post not found");
          }
        } else {
          setError("No posts available");
          console.error("No posts available");
        }
      } catch (e) {
        setError("Error fetching Intro post");
        console.error("Error fetching Intro post:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroPost(); // Call the async function
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>; // Display any errors

  // Extract content from the intro post
  const { title, coverImage, content } = introPost.fields;

  // Rich Text rendering options
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

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-start p-8 gap-8">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-2xl lg:text-2xl font-extrabold leading-tight hover:skew-y-1 hover:scale-105 transition-transform duration-700 ease-in-out">
            {title || "Intro Title"}
          </h1>

          {/* Description Section */}
          <div className="text-base md:text-base lg:text-base font-extralight mt-4 pr-0 md:pr-20 custom-rich-text">
            {content ? (
              documentToReactComponents(content, contentfulOptions) // Render rich text content
            ) : (
              <p>No content available</p>
            )}
          </div>
        </div>

        {/* Image Section */}
        {coverImage?.fields?.file?.url && (
          <div className="flex-1">
            <img 
              src={`https:${coverImage.fields.file.url}`}
              alt={title || "Hero Image"}
              className="w-full h-auto rounded-xl hover:skew-y-1 hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}