  import Card from "@/components/card";
  import { getAllPosts } from "@/contentful/core";
  import DefaultLayout from "@/layouts/default";
  import { useEffect, useState } from "react";
  import { Link } from "react-router-dom"; // Import Link from react-router-dom

  export default function IndexPage() {
    const [blogPosts, setBlogPosts] = useState<any>([]);

    useEffect(() => {
      const getBlogData = async () => {
        const blogData = await getAllPosts();
        console.log('Full Blog Data Response:', blogData); // Log full response
        if (blogData) {
          console.log('Fetched Blog Data:', blogData.items); // Log full structure
          setBlogPosts(blogData.items); // Assuming 'items' contains the blog posts
        }
      };

      getBlogData(); // Call the async function   
    }, []);

    if (!blogPosts.length) return <p>Loading...</p>;

    return (
      <DefaultLayout>
        {/* Hero Section */}
        <div className="flex flex-col items-start p-8">
          {/* Hero Heading */}
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-extrabold leading-tight">
            evgenii.ca
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-extralight mt-4">
            design & web development
          </p>

          {/* Large Format Image */}
          <div className="mt-8 w-full">
            <Link to="/intro">
              <img 
                src={blogPosts[0].fields.coverImage?.fields?.file?.url}
                alt="Hero Image" 
                className="w-full h-auto rounded-xl hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </Link>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div className="flex place-content-center flex-wrap gap-6 mt-12 px-8">
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
      </DefaultLayout>
    );
  }
