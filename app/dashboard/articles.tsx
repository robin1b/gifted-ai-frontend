import type { Post } from "./page";

export default function Articles({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return <p>Er zijn nog geen artikelen.</p>;
  }
  function excerpt(text: string, wordCount: number = 20) {
    const words = text.split(" ");
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(" ") + "...";
  }
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {posts.map((post) => (
        <article
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
        </article>
      ))}
    </div>
  );
}
