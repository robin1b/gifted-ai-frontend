import type { Post } from "./page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Articles({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-600 text-lg mb-4">Er zijn nog geen artikelen.</p>

        <Button
          asChild
          className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg"
        >
          <Link href="/dashboard/create">Maak een artikel</Link>
        </Button>
      </div>
    );
  }
  function excerpt(text: string, wordCount: number = 20) {
    const words = text.split(" ");
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  }
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {posts.map((post) => (
        <Link
          href={`/dashboard/${post.id}`}
          key={post.id}
          className="
            border border-border 
            rounded-xl 
            p-5 
            bg-card 
            shadow-sm 
            hover:shadow-md 
            transition-shadow 
            flex flex-col justify-between
          "
        >
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {post.title}
            </h2>

            <p className="text-muted-foreground mb-4 leading-relaxed">
              {excerpt(post.content, 20)}
            </p>
          </div>

          <footer className="text-sm text-muted-foreground">
            Door: {post.author.name}
          </footer>
        </Link>
      ))}
    </div>
  );
}
