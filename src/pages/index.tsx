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
import { useGeo } from "@/hooks/useGeo";

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

  // Fetch the visitor's IP
  const [ip, setIp] = useState<string | null>(null);
  const [ipError, setIpError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((r) => {
        if (!r.ok) throw new Error(`IP fetch failed: ${r.status}`);
        return r.json();
      })
      .then((j) => {
        console.log('IP fetched:', j.ip);
        setIp(j.ip);
      })
      .catch((err) => {
        console.error('IP fetch error:', err);
        setIpError(err.message);
      });
  }, []);

  // Lookup geo for that IP
  const { data: geo, error: geoError } = useGeo(ip);
  console.log('Geo data:', geo, 'Geo error:', geoError);

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
      <div className="flex flex-col items-start px-8 pb-24 pt-8 max-w-[900px] mx-auto">
        {/* <h1 className="text-2xl font-light hover:skew-x-6 hover:scale-110 transition duration-700">
          Welcome to my website.
        </h1> */}
        {/* <p className="text-lg font-extralight mt-2 hover:skew-x-3 hover:scale-105 transition duration-700">
          I'm a designer and developer. Specializing in React based web
          applications.
        </p> */}

        {/* ip Stack API - Geo greeting*/}
        <div className="flex flex-col items-start pt-8 pb-10s max-w-[900px] ">
          {ipError && <p className="text-red-600">IP Error: {ipError}</p>}
          {geoError && <p className="text-red-600">Geo Error: {geoError}</p>}
          {!ip && !ipError && (
            <p className="text-sm text-gray-400">Getting your IP...</p>
          )}
          {ip && !geo && !geoError && (
            <p className="text-sm text-gray-400">Detecting location...</p>
          )}
          {geo && (
            <p className="text-lg font-light text-gray-500">
              Welcome to my website, person from{" "}
              {geo.city}, {geo.region_name}, {geo.country_name}.
            </p>
          )}
        </div>

        {/* <ShinyText
          text="design & web development"
          speed={3} // 3-second shine cycle
          className="text-lg font-extralight mt-2 hover:skew-x-3 hover:scale-105 transition duration-700"
        /> */}
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
