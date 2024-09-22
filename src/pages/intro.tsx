import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { getAllPosts } from "@/contentful/core";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'; // Import for rendering rich text



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

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-start p-8 gap-8">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-4xl lg:text-4xl font-extrabold leading-tight hover:skew-y-1 hover:scale-105 transition-transform duration-700 ease-in-out">
            {title || "Intro Title"}
          </h1>

          {/* Description Section */}
          <div className="text-sm md:text-sm lg:text-base font-extralight mt-4 pr-20 custom-rich-text">
            {content ? (
              documentToReactComponents(content) // Render rich text content
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