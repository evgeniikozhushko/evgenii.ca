import { Link } from "@nextui-org/link";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-2 flex-grow pt-0">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        {/* <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">NextUI</p>
        </Link> */}
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui.org/"
          title="nextui.org homepage"
        >
          <span className="text-default-400">Powered by</span>
          <p className="text-default-600">NextUI</p>
          {/* //text-primary */}
        </Link>
      </footer>
    </div>
  );
}
