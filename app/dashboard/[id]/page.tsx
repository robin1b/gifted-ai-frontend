import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Post } from "../page";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const res = await fetch(
    `https://powderblue-turtle-512586.hostingersite.com/api/v1/posts/${id}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <p className="text-center mt-20">Artikel niet gevonden.</p>;
  }

  const post: Post = await res.json();

  return (
    <div className="max-w-3xl mx-auto pt-28 px-6 pb-20">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground mb-8">
        Door <strong>{post.author.name}</strong> —{" "}
        {new Date(post.created_at).toLocaleDateString("nl-BE")}
      </p>
      <article className="prose prose-neutral dark:prose-invert">
        {post.content}
      </article>
    </div>
  );
}
