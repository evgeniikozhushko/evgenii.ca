import { documentToReactComponents } from "@contentful/rich-text-react-renderer"; // Import rich text renderer
import { MARKS, BLOCKS, INLINES } from "@contentful/rich-text-types"; // Import rich text types
import { getAllPosts, getOrderedPosts } from "@/contentful/core";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { Card, CardHeader, Image } from "@nextui-org/react";
import PostModal from "@/components/PostModal";
import ShinyText from './ShinyText';

export default function IndexPage() {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const fallbackImage =
    "//images.ctfassets.net/vrssbejn74f5/1TddS8rtGvdvzXmvIzSnZU/4c436f876730492e22d6923d2d803ead/2023_BVCAS_blog.jpg";

  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        let data = await getOrderedPosts("fields.position", "desc");
        if (!data?.items?.length) data = await getAllPosts({ order: "-fields.position" });
        if (!data?.items?.length) data = await getAllPosts({ order: "-fields.Position" });
        const items = data?.items || [];
        const filtered = items.filter((p: any) => p.fields.title !== "Intro");
        filtered.sort((a: any, b: any) => (b.fields.position || 0) - (a.fields.position || 0));
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
    let i = 0, ri = 0;
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
      <div className="flex flex-col items-start p-6 pb-16">
        <h1 className="text-3xl font-extrabold hover:skew-x-6 hover:scale-110 transition duration-700">
          evgenii.ca
        </h1>
        <p className="text-lg font-extralight mt-2 hover:skew-x-3 hover:scale-105 transition duration-700">
          design + web development
        </p>
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
              const isSmall = (colIdx === 0 && smallFirst) || (colIdx === 1 && !smallFirst);
              span = isSmall ? "col-span-12 sm:col-span-5" : "col-span-12 sm:col-span-7";
            }

            const url = post.fields.coverImage?.fields?.file?.url;
            const imageUrl = url ? `https:${url}` : fallbackImage;

            return (
              <Card
                key={post.sys.id}
                isPressable
                onPress={() => setSelectedPost(post)}
                // className={`${span} h-[300px] bg-white relative`}
                className={`${span} h-[300px] bg-white relative`}
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
                  <h6 className="text-black font-medium text-lg">
                    {title}
                  </h6>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
      <PostModal
        post={selectedPost}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </DefaultLayout>
  );
}
