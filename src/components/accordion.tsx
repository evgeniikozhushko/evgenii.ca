import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { getAllPosts } from "@/contentful/core"; // Ensure this points to your Contentful data fetch file

export default function AccordionComponent() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllPosts(); // Fetch all posts from Contentful
      if (data && data.items) {
        setPosts(data.items); // Set the posts into state
      }
    };

    fetchData(); // Call the function to fetch data when the component loads
  }, []);

  if (!posts.length) return <p>Loading...</p>;

  return (
    <Accordion defaultExpandedKeys={["0"]}>
      {posts.map((post: any, index: number) => (
        <AccordionItem
          key={post.sys.id} // Dynamic key based on Contentful post ID
          aria-label={post.fields.title} // Fetch the post title for aria-label
          subtitle="Press to expand"
          title={post.fields.title} // Fetch the post title for Accordion title
        >
          <p>{post.fields.content || "No content available"}</p> {/* Fetch and display the content */}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
