import { documentToReactComponents } from "@contentful/rich-text-react-renderer"; // Import rich text renderer
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types"; // Import rich text types
import { getAllPosts, getOrderedPosts } from "@/contentful/core";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Card, CardHeader, Image } from "@nextui-org/react";
import PostModal from "@/components/PostModal";
import ShinyText from "@/components/ShinyText";
import "@/styles/ShinyText.css";
import TextPressure from "@/components/TextPressure";
import "@/styles/spotlight.css";
import About from "./about";

export default function IndexPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const fallbackImage =
    "//images.ctfassets.net/vrssbejn74f5/1TddS8rtGvdvzXmvIzSnZU/4c436f876730492e22d6923d2d803ead/2023_BVCAS_blog.jpg";

  // derive the post you're on
  const selectedPost = selectedPostId
    ? blogPosts.find((p) => p.sys.id === selectedPostId)
    : null;
  const selectedIndex = selectedPost
    ? blogPosts.findIndex((p) => p.sys.id === selectedPostId)
    : -1;

  useEffect(() => {
    const load = async () => {
      try {
        let data = await getOrderedPosts("fields.position", "desc");
        if (!data?.items?.length)
          data = await getAllPosts({ order: "-fields.position" });
        if (!data?.items?.length)
          data = await getAllPosts({ order: "-fields.Position" });
        const items = data?.items || [];
        const filtered = items.filter((p: any) => p.fields.title !== "Intro");
        filtered.sort(
          (a: any, b: any) =>
            (b.fields.position || 0) - (a.fields.position || 0)
        );
        setBlogPosts(filtered);
      } catch (e) {
        console.error(e);
        setBlogPosts([]);
      }
    };
    load();
  }, []);

  // Chunk rows by sizes 3,2,2
  const rows = (): any[][] => {
    const sizes = [3, 2, 2];
    const out: any[][] = [];
    let i = 0,
      ri = 0;
    while (i < blogPosts.length) {
      const n = sizes[ri % sizes.length];
      out.push(blogPosts.slice(i, i + n));
      i += n;
      ri++;
    }
    return out;
  };

  if (!blogPosts.length) return <p>Loading...</p>;

  return (
    <DefaultLayout>
      {/* Hero */}
      <div
        className="
          relative
          w-full
          max-w-[900px]
          mx-auto
          px-4      
          sm:px-8    
          h-[100px]
          sm:h-[200px]
          md:h-[300px]
        "
      >
        <TextPressure
          text="Hello!"
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="var(--nextui-colors-foreground)"
          strokeColor="#ff0000"
          minFontSize={36}
        />
      </div>
      <div className="flex flex-col items-start px-8 pb-8 max-w-[900px] mx-auto">
      <About />
        {/* <h1 className="text-md font-extralight hover:skew-x-6 hover:scale-110 transition duration-700 pl-2">
          Welcome to my website.
        </h1> */}
      </div>

      {/* Posts Grid with pattern 3-2-2 */}
      <div className="grid grid-cols-12 gap-4 max-w-[900px] mx-auto mb-16 px-8">
        {rows().map((row, rowIdx) =>
          row.map((post: any, colIdx: number) => {
            const title = post.fields.title || "Untitled";
            const postType = post.fields.postType || "Type";

            // Compute grid span: full width on mobile, responsive on sm+
            let span = "col-span-12";
            if (row.length === 3) span = "col-span-12 sm:col-span-4";
            else if (row.length === 2) {
              const smallFirst = rowIdx % 3 === 1;
              const isSmall =
                (colIdx === 0 && smallFirst) || (colIdx === 1 && !smallFirst);
              span = isSmall
                ? "col-span-12 sm:col-span-5"
                : "col-span-12 sm:col-span-7";
            }

            const url = post.fields.coverImage?.fields?.file?.url;
            const imageUrl = url ? `https:${url}` : fallbackImage;

            return (
              <Card
                key={post.sys.id}
                isPressable
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--x", `${x}px`);
                  e.currentTarget.style.setProperty("--y", `${y}px`);
                }}
                onPress={() => setSelectedPostId(post.sys.id)}
                className={`${span} h-[300px] bg-white relative spotlight`}
              >
                {/* Image behind header */}
                <Image
                  removeWrapper
                  alt={title}
                  className="absolute inset-0 w-full h-full object-scale-down z-0"
                  src={imageUrl}
                />
                {/* Header on top */}
                <CardHeader className="absolute z-10 top-2 left-2 flex-col items-start">
                  <h6 className="text-gray-500 font-medium text-xs uppercase">
                    {postType}
                  </h6>
                  <h6 className="text-black font-medium text-lg">{title}</h6>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
      <PostModal
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPostId(null)}
        onBack={() => {
          if (selectedIndex > 0) {
            setSelectedPostId(blogPosts[selectedIndex - 1].sys.id);
          }
        }}
        onNext={() => {
          if (selectedIndex < blogPosts.length - 1) {
            setSelectedPostId(blogPosts[selectedIndex + 1].sys.id);
          }
        }}
      />
    </DefaultLayout>
  );
}
